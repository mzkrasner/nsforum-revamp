"use server";

import postToEmail from "@/shared/lib/postToEmail";
import { fetchPost } from "@/shared/orbis/queries";
import axios from "axios";

export const notifySubscribers = async (streamId: string) => {
  console.log("fetching post: ", streamId);
  const post = await fetchPost({ filter: { stream_id: streamId } });
  console.log("post: ", post);
  if (!post) throw new Error("No post found");

  const emailContent = await postToEmail(post);

  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_SST_URL}/posts/${streamId}/notify-subscribers`,
    {
      emailContent,
    },
  );
  return data;
};
