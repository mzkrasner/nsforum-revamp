// "use server";

import { CeramicDocument } from "@useorbis/db-sdk";
import { ilike } from "@useorbis/db-sdk/operators";
import { catchError } from "@useorbis/db-sdk/util";
import { isNil, omitBy } from "lodash-es";
import { models, orbisdb } from ".";
import { escapeSQLLikePattern } from "../lib/utils";
import { GenericCeramicDocument, OnlyStringFields, OrbisDBRow } from "../types";
import { Category, CategorySuggestion } from "../types/category";
import { CommentType } from "../types/comment";
import { Post } from "../types/post";
import { Reaction, ReactionCounter } from "../types/reactions";
import { Tag } from "../types/tag";

export type PaginationOptions = {
  page?: number;
  pageSize?: number;
};

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
export type FetchCommentsArg = {
  filter: FetchCommentsFilter;
  pagination?: PaginationOptions;
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
    .where({ status: "published", ...omitBy(filter, isNil) })
    .limit(pageSize)
    .offset(offset);
  const [result, error] = await catchError(() => selectStatement?.run());
  if (error) throw new Error(`Error while fetching comments: ${error}`);
  const comments = result.rows || [];
  return comments as OrbisDBRow<CommentType>[];
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
  const offset = page * pageSize;
  const selectStatement = orbisdb
    .select(...fields)
    .from(models.posts.id)
    .where({
      status: "published",
      ...filter,
    })
    .limit(pageSize)
    .offset(offset)
    .orderBy(...orderBy);

  const [result, error] = await catchError(() => selectStatement?.run());
  if (error) throw new Error(`Error while fetching posts: ${error}`);
  const posts = result.rows;
  return posts as OrbisDBRow<Post>[];
};

export type FetchCategorySuggestionsOptions = PaginationOptions & {
  filter?: Record<string, any>;
};

export const fetchCategorySuggestions = async (
  options: FetchCategorySuggestionsOptions = {},
) => {
  const { page = 0, pageSize = 10, filter = {} } = options;
  const offset = page * pageSize;

  //   const graphql = `{
  //     ${models.categorySuggestions.name}(filter: {}) {
  //       stream_id
  //       name
  //       description
  //       status
  //     }
  //   }
  // `;

  //   const { data } = await axios.post(
  //     `${process.env.NEXT_PUBLIC_ORBIS_NODE_URL}/global/graphql`,
  //     {
  //       query: graphql,
  //     },
  //   );

  //   const categorySuggestions: OrbisDBRow<CategorySuggestion>[] =
  //     data?.data?.[models.categorySuggestions.name] || [];

  //   return categorySuggestions;

  const selectStatement = orbisdb
    .select()
    .from(models.categorySuggestions.id)
    .where(filter)
    .limit(pageSize)
    .offset(offset);

  const [result, error] = await catchError(() => selectStatement?.run());
  if (error)
    throw new Error(`Error while fetching category suggestions: ${error}`);
  const categorySuggestions = result.rows;
  return categorySuggestions as OrbisDBRow<CategorySuggestion>[];
};

export type FetchCategoriesOptions = {
  fields?: string[];
  filter?:
    | Record<string, any>
    | Partial<OnlyStringFields<Category & CeramicDocument["content"]>>;
} & PaginationOptions;
export const fetchCategories = async (options?: FetchCategoriesOptions) => {
  const { page = 0, pageSize = 10, fields = [], filter = {} } = options || {};
  const offset = page * pageSize;
  const selectStatement = orbisdb
    .select(...fields)
    .from(models.categories.id)
    .where(filter)
    .limit(pageSize)
    .offset(offset);

  const [result, error] = await catchError(() => selectStatement?.run());
  if (error) throw new Error(`Error while fetching categories: ${error}`);
  const categories = result.rows;
  return categories as OrbisDBRow<Category>[];
};

export const fetchCategory = async (
  filter: FetchCategoriesOptions["filter"],
) => {
  const res = await fetchCategories({
    page: 0,
    pageSize: 1,
    filter,
  });
  return res.length ? res[0] : null;
};

export const fetchReactionCounter = async (filter: {
  content_id: string;
  model: string;
}) => {
  const statement = orbisdb
    .select()
    .from(models.reaction_counter.id)
    .where(filter);

  const [result, error] = await catchError(() => statement.run());
  if (error) throw new Error(`Error while fetching reaction counter: ${error}`);
  if (!result?.rows.length) return null;

  const reaction = result.rows[0] as OrbisDBRow<ReactionCounter>;
  return reaction;
};

export const fetchReaction = async (filter: {
  content_id: string;
  user_id: string;
}) => {
  const statement = orbisdb.select().from(models.reactions.id).where(filter);

  const [result, error] = await catchError(() => statement.run());
  if (error) throw new Error(`Error while fetching reaction: ${error}`);
  if (!result?.rows.length) return null;

  const reaction = result.rows[0] as OrbisDBRow<Reaction>;
  return reaction;
};

export const fetchTagByName = async (name: string) => {
  const statement = orbisdb
    .select()
    .from(models.tags.id)
    .where({ name: ilike(escapeSQLLikePattern(name)) });
  const [result, error] = await catchError(() => statement.run());
  if (error) throw new Error(`Error while fetching reaction counter: ${error}`);
  if (!result?.rows.length) return null;
  return result.rows[0] as OrbisDBRow<Tag>;
};

export const createNewTag = async (data: Tag) => {
  const statement = orbisdb.insert(models.tags.id).value(data);
  const validation = await statement.validate();
  if (!validation.valid) {
    throw new Error(`Error during tag validation: ${validation.error}`);
  }

  const [result, error] = await catchError(() => statement.run());
  if (error) throw new Error(`Error during tag creation: ${error}`);

  if (!result) return null;
  return result as GenericCeramicDocument<Tag>;
};

export const updateTag = async (tagId: string, data: Tag) => {
  const statement = orbisdb.update(tagId).set(data);

  const [result, error] = await catchError(() => statement.run());
  if (error) throw new Error(`Error during tag update: ${error}`);

  if (!result) return null;
  return result as GenericCeramicDocument<Tag>;
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
  const offset = page * pageSize;
  const selectStatement = orbisdb
    .select(...fields)
    .from(models.tags.id)
    .where(filter)
    .limit(pageSize)
    .offset(offset)
    .orderBy(...orderBy);

  const [result, error] = await catchError(() => selectStatement?.run());
  if (error) throw new Error(`Error while fetching tags: ${error}`);
  const tags = result.rows;
  return tags as OrbisDBRow<Tag>[];
};
