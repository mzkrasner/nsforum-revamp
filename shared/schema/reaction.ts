import { z } from "zod";

export const reactionSchema = z.object({
  content_id: z.string().trim().min(1),
  type: z.enum(["upvote", "downvote", "none"]),
  user_id: z.string().trim().min(1),
  model: z.enum(["posts", "comments"]),
});

export type ReactionSchema = z.infer<typeof reactionSchema>;
