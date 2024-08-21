import useAuth from "@/shared/hooks/useAuth";
import useOrbis from "@/shared/hooks/useOrbis";
import { catchError } from "@/shared/orbis/utils";
import { PostStatus } from "@/shared/schema/post";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { produce } from "immer";
import { isNil, omitBy } from "lodash-es";
import { useRouter } from "next/navigation";
import { GenericCeramicDocument, OrbisDBRow } from "../types";
import { CommentType } from "../types/comment";

type Props = { commentId: string };
const useComment = ({ commentId }: Props) => {
  const router = useRouter();

  const queryClient = useQueryClient();

  const { db } = useOrbis();
  const { connectOrbis } = useAuth();

  const deleteComment = async () => {
    // Orbis does not support delete statements yet
    // To delete a comment change the deleted field to true
    if (!db) return;
    await connectOrbis(); // Does nothing if user is already connected
    if (!db.getConnectedUser()) {
      throw new Error("Cannot create a comment without connection to orbis");
    }

    const insertStatement = db
      .update(commentId)
      .set({ status: "deleted" as PostStatus });
    const [result, error] = await catchError(() => insertStatement.run());
    if (error) throw new Error(`Error during create comment query: ${error}`);
    if (!result) throw new Error("No result was returned from orbis");
    return result as GenericCeramicDocument<CommentType>;
  };

  const deleteCommentMutation = useMutation({
    mutationKey: ["delete-comment"],
    mutationFn: deleteComment,
    onSuccess: (result) => {
      // console.log("Deletion result: ", result);
      if (!result?.content) return;
      const queryKey = [
        "comments",
        omitBy(
          {
            postId: result.content.postId,
            parentId: result.content.parentId,
          },
          isNil,
        ),
      ];
      const commentsQueryData =
        queryClient.getQueryData<InfiniteData<OrbisDBRow<CommentType>[]>>(
          queryKey,
        );
      // console.log("Before optimistic update: ", commentsQueryData);
      if (commentsQueryData) {
        queryClient.setQueryData(
          queryKey,
          produce(commentsQueryData, (draft) => {
            outerLoop: for (let i = 0; i < draft.pages.length; i++) {
              const commentPage = draft.pages[i];
              for (let j = 0; j < commentPage.length; j++) {
                const c = commentPage[j];
                if (c.stream_id === result.id) {
                  // console.log("Matched");
                  // console.log("Draft page before: ", draft.pages[i]);
                  draft.pages[i].splice(j, 1);
                  // console.log("Draft page after: ", draft.pages[i]);
                  break outerLoop;
                }
              }
            }
          }),
        );
      }
      // console.log(
      //   "After optimistic update: ",
      //   queryClient.getQueryData<InfiniteData<OrbisDBRow<CommentType>[]>>(
      //     queryKey,
      //   ),
      // );
      // queryClient.setQueryData(["comment", { commentId }], (comment: any) => ({
      //   ...comment,
      //   status: "deleted",
      // }));
      // queryClient.removeQueries({
      //   queryKey: ["comment", { commentId }],
      //   exact: true,
      // });
    },
  });

  return { deleteCommentMutation };
};

export default useComment;
