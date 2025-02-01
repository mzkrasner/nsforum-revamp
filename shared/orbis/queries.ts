// "use server";

import { env } from "@/env";
import { CeramicDocument } from "@useorbis/db-sdk";
import { count, ilike } from "@useorbis/db-sdk/operators";
import { isNil, omitBy } from "lodash-es";
import { escapeSQLLikePattern } from "../lib/utils";
import { OnlyStringFields, OrbisDBRow } from "../types";
import { Category, CategorySuggestion } from "../types/category";
import { CommentType } from "../types/comment";
import { Post } from "../types/post";
import { Profile } from "../types/profile";
import { Reaction } from "../types/reactions";
import { Tag } from "../types/tag";
import { fetchRowsPage, findRow, updateRow } from "./utils";

export type PaginationOptions = {
  page?: number;
  pageSize?: number;
};

export const fetchUser = async (
  filter: Partial<Omit<OrbisDBRow<Profile>, "image">>,
) => {
  return await findRow<Profile>({
    model: "users",
    where: filter,
  });
};

export type FetchPostArg = {
  filter: Partial<Omit<OrbisDBRow<Post>, "tags" | "body" | "preview">>;
  columns?: any[];
};

export const fetchPost = async ({ filter, columns = [] }: FetchPostArg) => {
  if (!filter) throw new Error("Cannot fetch post without a filter");
  return await findRow<Post>({
    model: "posts",
    select: columns,
    where: omitBy(filter, isNil),
  });
};

export type FetchCommentsFilter = Partial<
  Omit<OrbisDBRow<CommentType>, "author" | "body" | "parent_ids">
> & { parent_ids?: any };
export type FetchCommentsArg = {
  filter: FetchCommentsFilter;
  pagination?: PaginationOptions;
};
export const fetchComments = async ({
  filter,
  pagination = {},
}: FetchCommentsArg) => {
  if (!filter.post_id && !filter.parent_ids && !filter.controller)
    throw new Error(
      "Cannot fetch comments without either a post_id, parent_ids, or controller field in the filter",
    );
  return await fetchRowsPage<CommentType>({
    model: "comments",
    where: { status: "published", ...omitBy(filter, isNil) },
    ...pagination,
  });
};

export type FetchPostsOptions = {
  fields?: string[];
  filter?:
  | Record<string, any>
  | Partial<OnlyStringFields<Post & CeramicDocument["content"]>>;
  orderBy?: [keyof OrbisDBRow<Post>, "asc" | "desc"][];
} & PaginationOptions;

export const fetchPosts = async (options?: FetchPostsOptions) => {
  const {
    page = 0,
    pageSize = 10,
    fields = [],
    filter = {},
    orderBy = [],
  } = options || {};
  const posts = await fetchRowsPage<Post>({
    model: "posts",
    select: fields,
    where: {
      status: "published",
      ...filter,
    },
    orderBy,
    page,
    pageSize,
  });
  return posts;
};

export type FetchCategorySuggestionsOptions = PaginationOptions & {
  filter?: Record<string, any>;
  orderBy?: [keyof OrbisDBRow<CategorySuggestion>, "asc" | "desc"][];
};

export const fetchCategorySuggestions = async (
  options: FetchCategorySuggestionsOptions = {},
) => {
  const { page = 0, pageSize = 10, filter = {}, orderBy = [] } = options;
  return await fetchRowsPage<CategorySuggestion>({
    model: "categorySuggestions",
    where: { ...filter, controller: env.NEXT_PUBLIC_APP_DID },
    pageSize,
    orderBy,
    page,
  });
};

export const fetchCategorySuggestion = async (id: string) => {
  return await findRow({
    model: "categorySuggestions",
    where: { stream_id: id, controller: env.NEXT_PUBLIC_APP_DID },
  });
};

export type FetchCategoriesOptions = {
  fields?: string[];
  filter?:
  | Record<string, any>
  | Partial<OnlyStringFields<Category & CeramicDocument["content"]>>;
} & PaginationOptions;
export const fetchCategories = async (options?: FetchCategoriesOptions) => {
  const { page = 0, pageSize = 10, fields = [], filter = {} } = options || {};
  return await fetchRowsPage<Category>({
    model: "categories",
    select: fields,
    // where: { ...filter, controller: env.NEXT_PUBLIC_APP_DID },
    page,
    pageSize,
  });
};

export const fetchCategory = async (
  filter: FetchCategoriesOptions["filter"],
) => {
  return await findRow<Category>({
    model: "categories",
    where: { ...filter, controller: env.NEXT_PUBLIC_APP_DID },
  });
};

export const fetchReaction = async (filter: {
  content_id: string;
  user_id: string;
}) => {
  return await findRow<Reaction>({
    model: "reactions",
    where: { ...filter, controller: env.NEXT_PUBLIC_APP_DID },
  });
};

export const fetchAllReactionsByContentId = async (content_id: string) => {
  return await fetchRowsPage<Reaction>({
    model: "reactions",
    where: { content_id },
  });
}

export const fetchTagByName = async (name: string) => {
  return findRow<Tag>({
    model: "tags",
    where: {
      name: ilike(escapeSQLLikePattern(name)),
      controller: env.NEXT_PUBLIC_APP_DID,
    },
  });
};

export const updateTag = async (tagId: string, data: Tag) => {
  return await updateRow({ id: tagId, set: data });
};

export type FetchTagsOptions = {
  fields?: string[];
  filter?:
  | Record<string, any>
  | Partial<OnlyStringFields<Tag & CeramicDocument["content"]>>;
  orderBy?: [keyof OrbisDBRow<Tag>, "asc" | "desc"][];
} & PaginationOptions;

export const fetchTags = async (options: FetchTagsOptions) => {
  const {
    page = 0,
    pageSize = 10,
    fields = [],
    filter = {},
    orderBy = [],
  } = options || {};
  return await fetchRowsPage<Tag>({
    model: "tags",
    select: fields,
    where: { ...filter, controller: env.NEXT_PUBLIC_APP_DID },
    orderBy,
    page,
    pageSize,
  });
};

export const fetchReactionTypeCounts = async ({
  model,
  content_id,
}: {
  model: string;
  content_id: string;
}) => {
  const allReactions = await fetchAllReactionsByContentId(content_id);
  // order the reactions from most recent to oldest
  allReactions.sort((a, b) => new Date(b.indexed_at).getTime() - new Date(a.indexed_at).getTime());
  const uniqueReactions = allReactions.reduce((acc, reaction) => {
    if (!acc[reaction.user_id]) {
      acc[reaction.user_id] = reaction;
    }
    return acc;
  }, {} as Record<string, Reaction>);
  console.log("Unique reactions", uniqueReactions);

  // count the number of unique upvotes and downvotes using the uniqueReactions object
  const upvotes = Object.values(uniqueReactions).filter(
    (reaction) => reaction.type === "upvote",
  );
  const downvotes = Object.values(uniqueReactions).filter(
    (reaction) => reaction.type === "downvote",
  );



  return {
    upvotes: upvotes.length,
    downvotes: downvotes.length,
  };
};
