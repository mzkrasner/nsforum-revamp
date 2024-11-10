"use server";

import { env } from "@/env";
import postToEmail from "@/shared/lib/postToEmail";
import { fetchPost } from "@/shared/orbis/queries";
import axios, { AxiosError } from "axios";

export const notifySubscribers = async (streamId: string) => {
  if (!env.NEXT_PUBLIC_SST_URL) return;

  try {
    const post = await fetchPost({ filter: { stream_id: streamId } });
    if (!post) throw new Error("No post found");

    const emailContent = await postToEmail(post);

    const { data } = await axios.post(
      `${env.NEXT_PUBLIC_SST_URL}/posts/${streamId}/notify-subscribers`,
      {
        emailContent,
      },
    );
    return data;
  } catch (error: unknown) {
    const message =
      (error as AxiosError).response?.data || (error as Error).message;
    console.error("Error while notifying subscribers: ", message);
  }
};
