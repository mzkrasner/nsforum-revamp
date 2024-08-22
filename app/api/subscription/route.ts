import {
  fetchSubscribedToCount,
  fetchSubscriberCount,
  fetchSubscription,
  updateSubscription,
} from "@/app/api/_orbis/queries";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "../_orbis";

const fetchSubscriptionSchema = z.object({
  author: z.string().min(1),
  reader: z.string().min(1),
});

export const GET = async (req: NextRequest) => {
  await connectDb();
  const { searchParams } = new URL(req.url);
  const author = searchParams.get("author");
  const reader = searchParams.get("reader");
  const query = { author, reader } as z.infer<typeof fetchSubscriptionSchema>;
  const isValid = fetchSubscriptionSchema.safeParse(query).success;
  if (!isValid)
    return NextResponse.json({ error: "Invalid data", status: 400 });

  const subscription = await fetchSubscription(query);
  const subscribedToCount = await fetchSubscribedToCount(author!);
  const subscriberCount = await fetchSubscriberCount(author!);

  return NextResponse.json({
    subscription,
    subscribedToCount,
    subscriberCount,
  });
};

const updateSubscriptionSchema = z.object({
  author: z.string().min(1),
  reader: z.string().min(1),
  subscribed: z.boolean(),
});

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const isValid = updateSubscriptionSchema.safeParse(body).success;
  if (!isValid)
    return NextResponse.json({ error: "Invalid data", status: 400 });

  await connectDb();
  const res = await updateSubscription(body);
  return NextResponse.json(res.content);
};
