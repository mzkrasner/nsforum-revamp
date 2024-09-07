import { z } from "zod";

export const categorySuggestionSchema = z.object({
  stream_id: z.string().optional().nullable(),
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().min(1, "Description is required"),
});

export type CategorySuggestionSchema = z.infer<typeof categorySuggestionSchema>;
