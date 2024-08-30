"use server";

import { CeramicDocument } from "@useorbis/db-sdk";
import { catchError } from "@useorbis/db-sdk/util";
// import { isNil, omitBy } from "lodash-es";
import { models, orbisdb } from ".";
import { OnlyStringFields, OrbisDBRow } from "../types";
// import { CommentType } from "../types/comment";
import { isNil, omitBy } from "lodash-es";
import { CommentType } from "../types/comment";
import { Post } from "../types/post";

export type FetchPostArg = {
  filter: Partial<Omit<OrbisDBRow<Post>, "tags" | "body" | "preview">>;
  columns?: (keyof Post)[];
};
export const fetchPost = async ({ filter, columns = [] }: FetchPostArg) => {
  // TODO: Add filtering by tags functionality

  if (!filter) throw new Error("Cannot fetch post without a filter");
  const selectStatement = orbisdb
    .select(...columns)
    .from(models.posts.id)
    .where(omitBy(filter, isNil));
  const [result, error] = await catchError(() => selectStatement?.run());
  if (error) throw new Error(`Error while fetching post: ${error}`);
  if (!result?.rows.length) return null;
  const post = result.rows[0];
  return post as OrbisDBRow<Post>;
};

export type FetchCommentsFilter = Partial<
  Omit<OrbisDBRow<CommentType>, "author" | "body" | "parent_ids">
> & { parent_ids?: any };
export type FetchCommentsPaginationOptions = {
  page?: number;
  pageSize?: number;
};
export type FetchCommentsArg = {
  filter: FetchCommentsFilter;
  pagination?: FetchCommentsPaginationOptions;
};
export const fetchComments = async ({
  filter,
  pagination = {},
}: FetchCommentsArg) => {
  const { page = 0, pageSize = 10 } = pagination;
  if (!filter.post_id && !filter.parent_ids && !filter.controller)
    throw new Error(
      "Cannot fetch comments without either a post_id, parent_ids, or controller field in the filter",
    );
  const offset = page * pageSize;
  const selectStatement = orbisdb
    .select()
    .from(models.comments.id)
    .where(omitBy(filter, isNil))
    .limit(pageSize)
    .offset(offset);
  const [result, error] = await catchError(() => selectStatement?.run());
  if (error) throw new Error(`Error while fetching comments: ${error}`);
  const comments = result.rows || [];
  return comments as OrbisDBRow<CommentType>[];
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
