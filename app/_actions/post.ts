"use server";

import { catchError } from "@/shared/lib/orbis/utils";
import { Post } from "@/shared/schema/post";
import { OrbisDB } from "@useorbis/db-sdk";
import config from "../_providers/orbis/config";

const orbis = new OrbisDB(config);

export const fetchPosts = async () => {
  try {
    const selectStatement = orbis
      .select()
      .from(process.env.NEXT_PUBLIC_POSTS_MODEL!);
    // .where({
    //   status: "published",
    // });
    const [result, error] = await catchError(() => selectStatement?.run());
    if (error) throw new Error(`Error while fetching posts: ${error}`);
    const posts =
      result.rows.map((post) => ({
        ...post,
        tags: post.tags ? JSON.parse(post.tags) : [],
      })) || [];
    return posts as Post[];
  } catch (error) {
    console.error(error);
  }
};
