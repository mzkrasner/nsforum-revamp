"use server";

import { connectDbWithSeed } from "@/app/api/_orbis";
import { contexts, models, orbisdb } from "@/shared/orbis";
import { fetchReactionCounter } from "@/shared/orbis/queries";
import { GenericCeramicDocument, OrbisDBRow } from "@/shared/types";
import {
  Reaction,
  ReactionCounter,
  ReactionType,
} from "@/shared/types/reactions";
import { catchError } from "@useorbis/db-sdk/util";

const fetchReaction = async (filter: Partial<Reaction> = {}) => {
  const statement = orbisdb.select().from(models.reactions.id).where(filter);

  const [result, error] = await catchError(() => statement.run());
  if (error) throw new Error(`Error while fetching reaction: ${error}`);
  if (!result?.rows.length) return null;

  const reaction = result.rows[0] as OrbisDBRow<Reaction>;
  return reaction;
};

const createReactionCounter = async (data: ReactionCounter) => {
  const statement = orbisdb.insert(models.reaction_counter.id).value(data);
  const validation = await statement.validate();
  if (!validation.valid) {
    throw new Error(`Error during reaction validation: ${validation.error}`);
  }

  const [result, error] = await catchError(() => statement.run());
  if (error) throw new Error(`Error while creating post reaction: ${error}`);
  return result as GenericCeramicDocument<ReactionCounter>;
};

const updateReactionCounter = async (
  id: string,
  data: Partial<ReactionCounter>,
) => {
  console.log("In shared, updating with: ", data);
  const statement = orbisdb.update(id).set(data);
  const [result, error] = await catchError(() => statement.run());
  if (error) throw new Error(`Error while updating post reaction: ${error}`);
  return result as GenericCeramicDocument<ReactionCounter>;
};

const createReaction = async (reaction: Reaction) => {
  const statement = orbisdb
    .insert(models.reactions.id)
    .value(reaction)
    .context(contexts.reactions);
  const validation = await statement.validate();
  if (!validation.valid) {
    throw new Error(`Error during reaction validation: ${validation.error}`);
  }

  const [result, error] = await catchError(() => statement.run());
  if (error) throw new Error(`Error during post reaction: ${error}`);
  return result;
};

const updateReaction = async (id: string, type: ReactionType) => {
  const statement = orbisdb.update(id).set({
    type,
  });

  const [result, error] = await catchError(() => statement.run());
  if (error) throw new Error(`Error during post reaction: ${error}`);
  return result;
};

export const reactToContent = async (reaction: Reaction) => {
  // Confirm that user has been verified and validate the reaction data

  const { content_id, user_id, model, type } = reaction;
  console.log("Reaction: ", reaction);

  await connectDbWithSeed();
  const existingReaction = await fetchReaction({ content_id, user_id, model });
  if (existingReaction?.type === type) {
    if (type === "none") return null;
    await updateReaction(existingReaction.stream_id, "none");
    const staleReactionCounter = await fetchReactionCounter({
      content_id,
      model,
    });
    if (staleReactionCounter) {
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
    await createReaction(reaction);
  }

  const staleReactionCounter = await fetchReactionCounter({
    content_id,
    model,
  });
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
