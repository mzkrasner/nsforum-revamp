import { upsertRow } from "../orbis/utils";
import { reactionSchema } from "../schema/reaction";
import { Reaction } from "../types/reactions";
import { isUserVerified } from "./auth";

export const reactToContent = async (reaction: Reaction) => {
  const isVerified = await isUserVerified();
  if (!isVerified) throw new Error("Unverified");

  const { success: isValid } = reactionSchema.safeParse(reaction);
  if (!isValid) throw new Error("Invalid data");

  const { content_id, user_id, model } = reaction;
  const reactionDocument = await upsertRow<Reaction>({
    model: "reactions",
    query: { where: { content_id, user_id, model } },
    value: reaction,
  });
  return reactionDocument;
};
