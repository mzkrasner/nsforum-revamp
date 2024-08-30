import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updatePostNotificationsSchema = z.object({
  author_did: z.string().min(1),
  authorName: z.string().min(1),
  postId: z.string().min(1),
});

export const POST = async (req: NextRequest) => {
  const body: z.infer<typeof updatePostNotificationsSchema> = await req.json();
  const isValid = updatePostNotificationsSchema.safeParse(body).success;
  if (!isValid)
    return NextResponse.json({ error: "Invalid data", status: 400 });

  // Update subscriber notifications

  return NextResponse.json({ success: true });
};

// TODO clear this and associated orbis queries
