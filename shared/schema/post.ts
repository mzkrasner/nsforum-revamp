import { z } from "zod";

export const POST_STATUSES = ["draft", "published", "deleted"] as const;
export type PostStatus = (typeof POST_STATUSES)[number];

export const postStatusSchema = z.enum([...POST_STATUSES]);

export const postFormSchema = z.object({
  author_name: z.string().min(1),
  slug: z.string().optional().nullable(),
  title: z
    .string({ message: "Post title is required" })
    .min(1, "Post title is required"),
  body: z
    .string({ message: "Post body is required" })
    .min(1, "Post body is required"),
  category: z.string({ message: "Post category is required" }),
  tags: z.array(z.string()),
  status: postStatusSchema,
});

export type PostFormType = z.infer<typeof postFormSchema>;
