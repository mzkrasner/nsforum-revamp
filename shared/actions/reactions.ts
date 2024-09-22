import { upsertRow } from "../orbis/utils";
import { Reaction } from "../types/reactions";

export const reactToContent = async (reaction: Reaction) => {
  const { content_id, user_id, model } = reaction;
  const reactionDocument = await upsertRow<Reaction>({
    model: "reactions",
    query: { where: { content_id, user_id, model } },
    value: reaction,
  });
  return reactionDocument;
};
