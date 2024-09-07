import {
  fetchSubscribedToCount,
  fetchSubscriberCount,
  fetchSubscription,
  updateSubscription,
} from "@/app/api/_orbis/queries";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDbWithSeed } from "../_orbis";

const fetchSubscriptionSchema = z.object({
  author_did: z.string().trim().min(1),
  reader_did: z.string().trim().min(1),
});

export const GET = async (req: NextRequest) => {
  await connectDbWithSeed();
  const { searchParams } = new URL(req.url);
  const author_did = searchParams.get("author");
  const reader_did = searchParams.get("reader");
  const query = { author_did, reader_did } as z.infer<
    typeof fetchSubscriptionSchema
  >;
  const isValid = fetchSubscriptionSchema.safeParse(query).success;
  if (!isValid)
    return NextResponse.json({ error: "Invalid data", status: 400 });

  const subscription = await fetchSubscription(query);
  const subscribedToCount = await fetchSubscribedToCount(author_did!);
  const subscriberCount = await fetchSubscriberCount(author_did!);

  return NextResponse.json({
    subscription,
    subscribedToCount,
    subscriberCount,
  });
};

const updateSubscriptionSchema = z.object({
  author_did: z.string().trim().min(1),
  reader_did: z.string().trim().min(1),
  subscribed: z.boolean(),
});

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const isValid = updateSubscriptionSchema.safeParse(body).success;
  if (!isValid)
    return NextResponse.json({ error: "Invalid data", status: 400 });

  await connectDbWithSeed();
  const res = await updateSubscription(body);
  return NextResponse.json(res.content);
};
