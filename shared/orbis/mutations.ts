// These only run in the frontend because they require orbis authentication
// Each function recieves one argument, an object that must have an 'orbisdb' field and other additional fields

import { OrbisDB } from "@useorbis/db-sdk";
import { catchError } from "@useorbis/db-sdk/util";
import { contexts, models } from ".";
import { GenericCeramicDocument } from "../types";
import { Post } from "../types/post";

export type CreatePostPayload = { orbisdb: OrbisDB; values: Post };
export const createPost = async ({ orbisdb, values }: CreatePostPayload) => {
  const statement = orbisdb
    .insert(models.posts.id)
    .value(values)
    .context(contexts.content);
  const validation = await statement.validate();
  if (!validation.valid) {
    throw new Error(`Error during create post validation: ${validation.error}`);
  }
  const [result, error] = await catchError(() => statement.run());
  if (error) throw new Error(`Error while creating post: ${error}`);
  if (!result) console.warn("No result was returned from create post");
  return result as GenericCeramicDocument<Post>;
};

export type UpdatePostPayload = {
  orbisdb: OrbisDB;
  postId: string;
  values: Post;
};
export const updatePost = async ({
  orbisdb,
  postId,
  values,
}: UpdatePostPayload) => {
  const statement = orbisdb.update(postId).set(values);
  const [result, error] = await catchError(() => statement.run());
  if (error) throw new Error(`Error while updating post: ${error}`);
  if (!result) console.warn("No result was returned from update post");
  return result as GenericCeramicDocument<Post>;
};
