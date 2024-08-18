import { z } from "zod";

export const categorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

export type Category = z.infer<typeof categorySchema>;
