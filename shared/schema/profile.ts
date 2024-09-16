import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  username: z.string().trim().min(1, "Username is required"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Not a valid email"),
});

export type ProfileFormType = z.infer<typeof profileSchema>;
