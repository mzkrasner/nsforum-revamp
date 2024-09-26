import usePost from "@/app/posts/_hooks/usePost";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { produce } from "immer";
import { isNil, omitBy } from "lodash-es";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { getHtmlContentPreview } from "../lib/utils";
import { createComment, updateComment } from "../orbis/mutations";
import { FetchCommentsArg } from "../orbis/queries";
import { commentFormSchema, CommentFormType } from "../schema/comment";
import { PostStatus } from "../schema/post";
import { OrbisDBRow } from "../types";
import { CommentType } from "../types/comment";
import useProfile from "./useProfile";

type Props = {
  comment?: OrbisDBRow<CommentType>;
  onSave?: () => void;
  parentIds?: string[];
  isReply?: boolean;
  fetchCommentsArg: FetchCommentsArg;
};

const useCommentForm = (props: Props) => {
  const {
    comment,
    onSave,
    parentIds = [],
    fetchCommentsArg,
    isReply = false,
  } = props || {};

  const { post } = usePost();
  const postId = post?.stream_id;

  const queryClient = useQueryClient();

  const { profile } = useProfile();

  const emptyFormValues: CommentType = {
    author_username: profile?.username || "",
    body: "",
    post_id: postId || "",
    parent_ids: parentIds.join("-"),
    status: "published",
  };
  const form = useForm<CommentFormType>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: comment || emptyFormValues,
  });
  const { reset, watch, setValue } = form;

  useEffect(() => {
    if (profile?.controller && !watch("author_username")) {
      setValue("author_username", profile?.username || "");
    }
  }, [profile, watch]);

  const saveFn = async (
    _values: CommentFormType,
    status: PostStatus = "published",
  ) => {
    const preview = getHtmlContentPreview(_values.body);
    const values = { ..._values, preview, status };
    if (comment) {
      return await updateComment({
        commentId: comment.stream_id,
        values,
      });
    } else {
      return await createComment({ values });
    }
  };

  const saveMutation = useMutation({
    mutationKey: ["comment", { postId }],
    mutationFn: saveFn,
    onSuccess: (result) => {
      if (!result?.content) return;
      reset(emptyFormValues);
      const { id, content, controller } = result;
      const queryKey = ["comments", omitBy(fetchCommentsArg, isNil)];
      const commentsQueryData =
        queryClient.getQueryData<InfiniteData<OrbisDBRow<CommentType>[]>>(
          queryKey,
        );
      const isNew = !comment;
      if (commentsQueryData) {
        if (isNew) {
          queryClient.setQueryData(
            queryKey,
            produce(commentsQueryData, (draft) => {
              draft.pages[draft.pages.length - 1].push({
                ...content,
                controller,
                stream_id: id,
                indexed_at: new Date().toISOString(),
              });
            }),
          );
        } else {
          queryClient.setQueryData(
            queryKey,
            produce(commentsQueryData, (draft) => {
              let staleComment;
              outerLoop: for (let i = 0; i < draft.pages.length; i++) {
                const commentPage = draft.pages[i];
                for (let j = 0; j < commentPage.length; j++) {
                  const c = commentPage[j];
                  if (c.stream_id === comment?.stream_id) {
                    staleComment = c;
                    break outerLoop;
                  }
                }
              }
              if (staleComment) Object.assign(staleComment, result.content);
            }),
          );
        }
      }
      onSave && onSave();
    },
    onError: console.error,
  });

  return { form, saveMutation };
};

export default useCommentForm;
