"use server";

import { connectDbWithSeed } from "@/app/api/_orbis";
import { fetchReactionCounter } from "@/shared/orbis/queries";
import {
  Reaction,
  ReactionCounter,
  ReactionType,
} from "@/shared/types/reactions";
import { revalidateTag } from "next/cache";
import { findRow, insertRow, updateRow } from "../orbis/utils";
import { reactionSchema } from "../schema/reaction";
import { isUserVerified } from "./auth";

const fetchReaction = async (filter: Partial<Reaction> = {}) => {
  return await findRow<Reaction>({ model: "reactions", where: filter });
};

const createReactionCounter = async (data: ReactionCounter) => {
  return await insertRow({ model: "reaction_counter", value: data });
};

const updateReactionCounter = async (
  id: string,
  data: Partial<ReactionCounter>,
) => {
  return await updateRow({ id, set: data });
};

const createReaction = async (reaction: Reaction) => {
  return await insertRow({ model: "reactions", value: reaction });
};

const updateReaction = async (id: string, type: ReactionType) => {
  console.log("updating reaction: ", { id, type });
  return await updateRow({ id, set: { type } });
};

export const reactToContent = async (reaction: Reaction) => {
  // Confirm that user has been verified and validate the reaction data
  const isVerified = await isUserVerified();
  console.log("is verified: ", isVerified);
  if (!isVerified) throw new Error("Unverified");

  const { success: isValid } = reactionSchema.safeParse(reaction);
  console.log("is valid: ", isValid);
  if (!isValid) throw new Error("Invalid data");

  const { content_id, user_id, model, type } = reaction;

  await connectDbWithSeed();
  const existingReaction = await fetchReaction({ content_id, user_id, model });
  console.log("existing reaction: ", existingReaction, type);
  if (existingReaction?.type === type) {
    if (type === "none") return null;
    await updateReaction(existingReaction.stream_id, "none");
    const staleReactionCounter = await fetchReactionCounter({
      content_id,
      model,
    });
    if (staleReactionCounter) {
      console.log("updating reaction counter");
      return await updateReactionCounter(staleReactionCounter?.stream_id, {
        upvotes:
          type === "upvote"
            ? Math.max(0, +staleReactionCounter.upvotes - 1)
            : +staleReactionCounter.upvotes,
        downvotes:
          type === "downvote"
            ? Math.max(0, +staleReactionCounter.downvotes - 1)
            : +staleReactionCounter.downvotes,
      });
    }
    return null;
  }

  if (existingReaction) {
    await updateReaction(existingReaction.stream_id, type);
  } else {
    console.log("creating reaction");
    await createReaction(reaction);
  }

  const staleReactionCounter = await fetchReactionCounter({
    content_id,
    model,
  });
  console.log("stale reaction counter: ", staleReactionCounter);
  if (!staleReactionCounter) {
    return await createReactionCounter({
      content_id,
      upvotes: type === "upvote" ? 1 : 0,
      downvotes: type === "downvote" ? 1 : 0,
      model,
    });
  } else {
    return await updateReactionCounter(staleReactionCounter.stream_id, {
      upvotes:
        type === "upvote"
          ? +staleReactionCounter.upvotes + 1
          : Math.max(0, +staleReactionCounter.upvotes - 1),
      downvotes:
        type === "downvote"
          ? +staleReactionCounter.downvotes + 1
          : Math.max(0, +staleReactionCounter.downvotes - 1),
    });
  }
};

export const revalidateTagFromClient = async (tag: string) => {
  revalidateTag(tag);
};
