import { z } from "zod";

export const postSchema = z.object({
  title: z
    .string({ message: "Post title is required" })
    .min(1, "Post title is required"),
  body: z
    .string({ message: "Post body is required" })
    .min(1, "Post body is required"),
  category: z.string({ message: "Post category is required" }),
  tags: z.array(z.string()),
  authors: z.array(z.string()).optional(),
});

export type Post = z.infer<typeof postSchema>;
