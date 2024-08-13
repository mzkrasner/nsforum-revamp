import config from "@/app/_providers/orbis/config";
import { CeramicDocument, OrbisDB } from "@useorbis/db-sdk";
import { Post } from "../schema/post";
import { catchError } from "./utils";

const orbis = new OrbisDB(config);

export const fetchPost = async (postId: string) => {
  if (!postId) throw new Error("Cannot fetch post without postId");
  const selectStatement = orbis
    ?.select()
    .from(process.env.NEXT_PUBLIC_POSTS_MODEL!)
    .where({
      stream_id: postId,
    });
  const [result, error] = await catchError(() => selectStatement?.run());
  if (error) throw new Error(`Error while fetching post: ${error}`);
  if (!result?.rows.length)
    throw new Error(`Error while fetching post: Post not found`);
  const { tags, ...rest } = result.rows[0];
  const post = {
    ...rest,
    tags: tags ? JSON.parse(tags) : [],
  };
  return post as Post & CeramicDocument["content"];
};

export const fetchPosts = async () => {
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
};