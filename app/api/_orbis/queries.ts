import { models } from "@/shared/orbis";
import { findRow, insertRow, updateRow } from "@/shared/orbis/utils";
import { CategorySuggestionSchema } from "@/shared/schema/categorySuggestion";
import { CategorySuggestion } from "@/shared/types/category";
import { Subscription } from "@/shared/types/subscription";
import { count } from "@useorbis/db-sdk/operators";
import axios from "axios";

export const fetchSubscription = async (
  query: Omit<Subscription, "subscribed">,
) => {
  if (!query.author_did || !query.reader_did) throw new Error("Invalid query");
  return await findRow<Subscription>({ model: "subscriptions", where: query });
};

export const updateSubscription = async (subscription: Subscription) => {
  const { author_did, reader_did } = subscription;
  const existingSubscription = await fetchSubscription({
    author_did,
    reader_did,
  });
  if (existingSubscription) {
    return await updateRow({
      id: existingSubscription.stream_id,
      set: subscription,
    });
  } else {
    return await insertRow({ model: "subscriptions", value: subscription });
  }
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

export const suggestCategory = async (
  categorySuggestion: CategorySuggestionSchema,
) => {
  return await insertRow<CategorySuggestion>({
    model: "categorySuggestions",
    value: { ...categorySuggestion, status: "pending" },
  });
};

export const fetchCategorySuggestion = async (id: string) => {
  const graphql = `{
    ${models.categorySuggestions.name}(filter: { stream_id: "${id}" }) {
      stream_id
      name
      description
    }
  }
`;
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_ORBIS_NODE_URL}/global/graphql`,
    {
      query: graphql,
    },
  );
  const categorySuggestions: CategorySuggestion[] =
    data?.data?.[models.categorySuggestions.name] || [];
  return categorySuggestions.length ? categorySuggestions[0] : null;
};
