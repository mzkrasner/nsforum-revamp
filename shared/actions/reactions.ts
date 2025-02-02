"use client";

import { upsertRow } from "../orbis/utils";
import { reactionSchema } from "../schema/reaction";
import { Reaction } from "../types/reactions";

export const reactToContent = async (reaction: Reaction) => {

  const { success: isValid } = reactionSchema.safeParse(reaction);
  if (!isValid) {
    const error = new Error("Invalid data");
    console.error(error);
    throw error;
  }

  const { content_id, user_id, model } = reaction;
  const reactionDocument = await upsertRow<Reaction>({
    model: "reactions",
    query: {
      where: { content_id, user_id, model },
    },
    value: reaction,
  });
  return reactionDocument;
};
