import { z } from "zod";
import { postStatusSchema } from "./post";

export const commentFormSchema = z.object({
  user: z.object({
    username: z.string().min(1),
    did: z.string().min(1),
  }),
  body: z.string().min(1),
  postId: z.string().min(1),
  topParentId: z.string().min(1),
  parentId: z.string().min(1),
  status: postStatusSchema,
});

export type CommentFormType = z.infer<typeof commentFormSchema>;
