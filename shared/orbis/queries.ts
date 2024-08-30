"use server";

import { CeramicDocument } from "@useorbis/db-sdk";
import { catchError } from "@useorbis/db-sdk/util";
// import { isNil, omitBy } from "lodash-es";
import { models, orbisdb } from ".";
import { OnlyStringFields, OrbisDBRow } from "../types";
// import { CommentType } from "../types/comment";
import { Post } from "../types/post";

export const fetchPost = async (filter: Partial<Omit<Post, "tags">>, columns: (keyof Post)[] = []) => {
  // TODO: Add filtering by tags functionality

  if (!filter) throw new Error("Cannot fetch post without a filter");
  const selectStatement = orbisdb.select(...columns).from(models.posts.id).where(filter);
  const [result, error] = await catchError(() => selectStatement?.run());
  if (error) throw new Error(`Error while fetching post: ${error}`);
  if (!result?.rows.length) return null;
  const post = result.rows[0];
  return post as OrbisDBRow<Post>;
};

// TODO: Refactor to use post slug instead of id
export type FetchCommentsOptions = {
  parentId?: string;
  topParentId?: string;
  page?: number;
  pageSize?: number;
} & ( // Must have at least a postId or controller
  | { postId: string; controller?: string }
  | { postId?: string; controller: string }
);
export const fetchComments = async (options: FetchCommentsOptions) => {
  const {
    postId,
    parentId,
    topParentId,
    page = 0,
    pageSize = 10,
    controller,
  } = options;
  return [];
  // if (!postId && !controller)
  //   throw new Error(
  //     "Cannot fetch comments without either a postId or controller",
  //   );
  // const offset = page * pageSize;
  // const selectStatement = orbisdb
  //   .select()
  //   .from(models.comments.id)
  //   .where(
  //     omitBy(
  //       {
  //         postId,
  //         parentId,
  //         topParentId,
  //         controller,
  //         status: "published",
  //       },
  //       isNil,
  //     ),
  //   )
  //   .limit(pageSize)
  //   .offset(offset);
  // const [result, error] = await catchError(() => selectStatement?.run());
  // if (error) throw new Error(`Error while fetching comments: ${error}`);
  // const comments = result.rows;
  // return comments as OrbisDBRow<CommentType>[];
};

export type FetchPostsOptions = {
  page?: number;
  pageSize?: 0;
  fields?: string[];
  filter?:
    | Record<string, any>
    | Partial<OnlyStringFields<Post & CeramicDocument["content"]>>;
};
export const fetchPosts = async (options?: FetchPostsOptions) => {
  const { page = 0, pageSize = 10, fields = [], filter = {} } = options || {};
  const offset = page * pageSize;
  const selectStatement = orbisdb
    .select(...fields)
    .from(models.posts.id)
    .where({
      status: "published",
      ...filter,
    })
    .limit(pageSize)
    .offset(offset);
  const [result, error] = await catchError(() => selectStatement?.run());
  if (error) throw new Error(`Error while fetching posts: ${error}`);
  const posts = result.rows;
  return posts as OrbisDBRow<Post>[];
};
