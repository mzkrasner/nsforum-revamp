import { CommentType } from "../types/comment";
import { Post } from "../types/post";
import { insertRow, updateRow } from "./utils";
import { orbisdb } from "../orbis"; // Import orbisdb to access the connected user

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

// New function to create a category with the user's controller
export type CreateCategoryPayload = {
  values: { name: string; description: string }; // Adjust as per your category schema
  controller: string; // User's address
};
export const createCategory = async ({ values, controller }: CreateCategoryPayload) => {
  return await insertRow({
    model: "categories",
    value: { ...values, controller }, // Set the controller to the user's address
  });
};

// New function to create a reaction with the user's controller
export type CreateReactionPayload = {
  values: { content_id: string; type: string }; // Adjust as per your reaction schema
  controller: string; // User's address
};
export const createReaction = async ({ values, controller }: CreateReactionPayload) => {
  return await insertRow({
    model: "reactions",
    value: { ...values, controller }, // Set the controller to the user's address
  });
};
