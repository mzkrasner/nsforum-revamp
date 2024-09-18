// "use server";

import { CeramicDocument } from "@useorbis/db-sdk";
import { ilike } from "@useorbis/db-sdk/operators";
import { isNil, omitBy } from "lodash-es";
import { escapeSQLLikePattern } from "../lib/utils";
import { OnlyStringFields, OrbisDBRow } from "../types";
import { Category, CategorySuggestion } from "../types/category";
import { CommentType } from "../types/comment";
import { Post } from "../types/post";
import { Profile } from "../types/profile";
import { Reaction, ReactionCounter } from "../types/reactions";
import { Tag } from "../types/tag";
import { fetchRowsPage, findRow, insertRow, updateRow } from "./utils";

export type PaginationOptions = {
  page?: number;
  pageSize?: number;
};

export const fetchUser = async (filter: Partial<Omit<OrbisDBRow<Profile>, "image">>) => {
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
};

export const fetchCategorySuggestions = async (
  options: FetchCategorySuggestionsOptions = {},
) => {
  const { page = 0, pageSize = 10, filter = {} } = options;
  return await fetchRowsPage<CategorySuggestion>({
    model: "categorySuggestions",
    where: filter,
    pageSize,
    page,
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
    where: filter,
    page,
    pageSize,
  });
};

export const fetchCategory = async (
  filter: FetchCategoriesOptions["filter"],
) => {
  return await findRow<Category>({ model: "categories", where: filter });
};

export const fetchReactionCounter = async (filter: {
  content_id: string;
  model: string;
}) => {
  return await findRow<ReactionCounter>({
    model: "reaction_counter",
    where: filter,
  });
};

export const fetchReaction = async (filter: {
  content_id: string;
  user_id: string;
}) => {
  return await findRow<Reaction>({ model: "reactions", where: filter });
};

export const fetchTagByName = async (name: string) => {
  return findRow<Tag>({
    model: "tags",
    where: { name: ilike(escapeSQLLikePattern(name)) },
  });
};

export const createNewTag = async (data: Tag) => {
  return await insertRow({ model: "tags", value: data });
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
    where: filter,
    orderBy,
    page,
    pageSize,
  });
};
