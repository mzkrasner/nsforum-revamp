import { z } from "zod";
import { postStatusSchema } from "./post";

export const commentFormSchema = z.object({
  author: z.object({
    username: z.string().trim().min(1),
    did: z.string().trim().min(1),
  }),
  body: z.string().trim().min(1),
  post_id: z.string().trim().min(1),
  parent_ids: z.string(),
  status: postStatusSchema,
});

export type CommentFormType = z.infer<typeof commentFormSchema>;
