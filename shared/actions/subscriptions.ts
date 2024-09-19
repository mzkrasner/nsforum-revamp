"use server";

import { connectDbWithSeed } from "@/app/api/_orbis";
import { findRow, insertRow, updateRow } from "@/shared/orbis/utils";
import { Subscription } from "@/shared/types/subscription";
import { count } from "@useorbis/db-sdk/operators";
import { z } from "zod";
import { fetchCurrentUserProfile } from "./auth";

export const fetchSubscription = async (query: {
  author_did: string;
  reader_did?: string;
}) => {
  const { author_did, reader_did } = query;
  if (!author_did || !reader_did) throw new Error("Invalid query");
  return await findRow<Subscription>({ model: "subscriptions", where: query });
};

export const fetchSubscribedToCount = async (did: string) => {
  const result = await findRow<{ count: number }>({
    model: "subscriptions",
    select: [count("author_did", "count")],
    where: {
      reader_did: did,
      subscribed: true,
    },
  });
  return result?.count || 0;
};

export const fetchSubscriberCount = async (did: string) => {
  const result = await findRow<{ count: number }>({
    model: "subscriptions",
    select: [count("reader_did", "count")],
    where: {
      author_did: did,
      subscribed: true,
    },
  });
  return result?.count || 0;
};

const fetchSubscriptionArgSchema = z.object({
  author_did: z.string().trim().min(1),
  reader_did: z.string().trim().min(1).optional().nullable(),
});
export type FetchSubscriptionArg = { author_did: string; reader_did?: string };
export const fetchSubscriptionData = async (query: FetchSubscriptionArg) => {
  const isValid = fetchSubscriptionArgSchema.safeParse(query).success;
  if (!isValid) throw new Error("Invalid data");

  const { author_did, reader_did } = query;
  const subscription = reader_did ? await fetchSubscription(query) : null;
  const subscribedToCount = await fetchSubscribedToCount(author_did!);
  const subscriberCount = await fetchSubscriberCount(author_did!);

  return {
    subscription,
    subscribedToCount,
    subscriberCount,
  };
};

const updateSubscriptionSchema = z.object({
  author_did: z.string().trim().min(1),
  subscribed: z.boolean(),
});
export const updateSubscription = async (
  subscription: Omit<Subscription, "reader_did">,
) => {
  const isValid = updateSubscriptionSchema.safeParse(subscription).success;
  if (!isValid) throw new Error("Invalid data");

  // Ensure they can only update their own subscription object
  const profile = await fetchCurrentUserProfile();
  if (!profile?.controller) throw new Error("Unable to fetch profile");

  await connectDbWithSeed();
  const { author_did } = subscription;
  const existingSubscription = await fetchSubscription({
    author_did,
    reader_did: profile.controller,
  });
  if (existingSubscription) {
    return await updateRow<Subscription>({
      id: existingSubscription.stream_id,
      set: subscription,
    });
  } else {
    return await insertRow<Subscription>({
      model: "subscriptions",
      value: { ...subscription, reader_did: profile.controller },
    });
  }
};
