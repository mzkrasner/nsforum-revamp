"use server";

import { connectDbWithSeed } from "@/app/api/_orbis";
import { upsertRow } from "../orbis/utils";
import { reactionSchema } from "../schema/reaction";
import { Reaction } from "../types/reactions";
import { isUserVerified } from "./auth";

export const reactToContent = async (reaction: Reaction) => {
  const appDid = await connectDbWithSeed();
  if (!appDid) {
    const error = new Error("Internal server error");
    console.error(error);
    throw error;
  }

  console.log("reaction: ", reaction);
  const isVerified = await isUserVerified();
  console.log("is verified: ", isVerified);
  if (!isVerified) {
    const error = new Error("Unverified");
    console.error(error);
    throw error;
  }

  const { success: isValid } = reactionSchema.safeParse(reaction);
  console.log("is valid: ", isValid);
  if (!isValid) {
    const error = new Error("Invalid data");
    console.log(error);
    throw error;
  }

  console.log("reacting...");
  const { content_id, user_id, model } = reaction;
  const reactionDocument = await upsertRow<Reaction>({
    model: "reactions",
    query: {
      where: { content_id, user_id, model, controller: appDid },
    },
    value: reaction,
  });
  console.log("doc: ", reactionDocument);
  return reactionDocument;
};
