import { CommentType } from "../types/comment";
import { Post } from "../types/post";
import { insertRow, updateRow } from "./utils";

export type CreatePostPayload = { values: Post };
export const createPost = async ({ values }: CreatePostPayload) => {
  return await insertRow({ model: "posts", value: values });
};

export type UpdatePostPayload = {
  postId: string;
  values: Post;
};
export const updatePost = async ({ postId, values }: UpdatePostPayload) => {
  return await updateRow({ id: postId, set: values });
};

export type CreateCommentPayload = {
  values: CommentType;
};
export const createComment = async ({ values }: CreateCommentPayload) => {
  return await insertRow({ model: "comments", value: values });
};

export type UpdateCommentPayload = {
  commentId: string;
  values: Partial<CommentType>;
};
export const updateComment = async ({
  commentId,
  values,
}: UpdateCommentPayload) => {
  return await updateRow<CommentType>({ id: commentId, set: values });
};
