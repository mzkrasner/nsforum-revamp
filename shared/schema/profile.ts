import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  username: z.string().trim().min(1, "Username is required"),
  image: z.string().optional(),
});

export type ProfileFormType = z.infer<typeof profileSchema>;
