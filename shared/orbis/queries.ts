"use server";

import { CeramicDocument } from "@useorbis/db-sdk";
import { models, orbis } from ".";
import { OnlyStringFields, OrbisDBRow } from "../types";
import { Post } from "../types/post";
import { catchError } from "./utils";

export const fetchPost = async (postId: string) => {
  if (!postId) throw new Error("Cannot fetch post without postId");
  const selectStatement = orbis?.select().from(models.posts).where({
    stream_id: postId,
  });
  const [result, error] = await catchError(() => selectStatement?.run());
  if (error) throw new Error(`Error while fetching post: ${error}`);
  if (!result?.rows.length)
    throw new Error(`Error while fetching post: Post not found`);
  const post = result.rows[0];
  return post as OrbisDBRow<Post>;
};

export type FetchPostOptions = {
  page?: number;
  pageSize?: 0;
  fields?: string[];
  filter?: Partial<OnlyStringFields<Post & CeramicDocument["content"]>>;
};
export const fetchPosts = async (options?: FetchPostOptions) => {
  const { page = 0, pageSize = 10, fields = [], filter = {} } = options || {};
  const offset = page * pageSize;

  const selectStatement = orbis
    .select(...fields)
    .from(models.posts)
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
