import { zodResolver } from "@hookform/resolvers/zod";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { produce } from "immer";
import { isNil, omitBy } from "lodash-es";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { models } from "../orbis";
import { catchError } from "../orbis/utils";
import { commentFormSchema, CommentFormType } from "../schema/comment";
import { PostStatus } from "../schema/post";
import { GenericCeramicDocument, OrbisDBRow } from "../types";
import { CommentType } from "../types/comment";
import useOrbis from "./useOrbis";
import useProfile from "./useProfile";

type Props = { comment?: OrbisDBRow<CommentType>; onSave?: () => void };

const useCommentForm = (props?: Props) => {
  const { comment, onSave } = props || {};
  const params = useParams();
  const postId = params.postId as string;

  const queryClient = useQueryClient();

  const { db } = useOrbis();
  const { profile } = useProfile();

  const form = useForm<CommentFormType>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: comment || {
      user: {
        username: profile?.username,
        did: profile?.controller,
      },
      postId,
      topParentId: postId,
      parentId: postId,
      status: "published",
    },
  });

  const saveFn = async (
    values: CommentFormType,
    status: PostStatus = "published",
  ) => {
    let statement;
    if (comment) {
      // console.log("Updating comment");
      // Update existing comment
      statement = db.update(comment.stream_id).set({ ...values, status });
    } else {
      // console.log("Creating comment");
      // Create new comment
      statement = db.insert(models.comments).value({ ...values, status });
      const validation = await statement.validate();
      if (!validation.valid) {
        throw new Error(
          `Error during create comment validation: ${validation.error}`,
        );
      }
    }
    const [result, error] = await catchError(() => statement.run());
    if (error) throw new Error(`Error during create comment query: ${error}`);
    if (!result) throw new Error("No result was returned from orbis");
    return result as GenericCeramicDocument<CommentType>;
  };

  const saveMutation = useMutation({
    mutationKey: ["comment", { postId }],
    mutationFn: saveFn,
    onSuccess: (result) => {
      if (!result?.content) return;
      // console.log("Result: ", result);
      const queryKey = ["comments", omitBy({ postId }, isNil)];
      const commentsQueryData =
        queryClient.getQueryData<InfiniteData<OrbisDBRow<CommentType>[]>>(
          queryKey,
        );
      // console.log("Existing comments b4: ", commentsQueryData);
      if (commentsQueryData) {
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
            // console.log("Stale comment: ", staleComment);
            if (staleComment) Object.assign(staleComment, result.content);
          }),
        );
      }
      // console.log("Comments after: ", queryClient.getQueryData(queryKey));
      onSave && onSave();
    },
    onError: console.error,
  });

  return { form, saveMutation };
};

export default useCommentForm;
