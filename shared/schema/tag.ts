import { z } from "zod";

export const tagSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().min(1, "Description is required"),
});

export type TagSchema = z.infer<typeof tagSchema>;
