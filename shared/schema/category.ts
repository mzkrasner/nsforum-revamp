import { z } from "zod";

export const categorySchema = z.object({
  stream_id: z
    .string()
    .regex(
      /^[a-z0-9\s]+$/,
      "String contains invalid characters. Only alphanumeric characters and spaces are allowed (no hyphens).",
    )
    .optional()
    .nullable(),
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().min(1, "Description is required"),
});

export type CategorySchema = z.infer<typeof categorySchema>;
