import { models, orbisdb } from "@/shared/orbis";
import { catchError } from "@/shared/orbis/utils";
import { OrbisDBRow } from "@/shared/types";
import { Subscription } from "@/shared/types/subscription";
import { InsertStatement, UpdateByIdStatement } from "@useorbis/db-sdk/query";

export const fetchSubscription = async (
  query: Omit<Subscription, "subscribed">,
) => {
  if (!query.author || !query.reader) throw new Error("Invalid query");
  const selectStatement = orbisdb
    .select()
    .from(models.subscriptions)
    .where(query);
  // console.log("Fetching query with: ", query);
  const [result, error] = await catchError(() => selectStatement?.run());
  if (error) throw new Error(`Error while fetching subscription: ${error}`);
  const subscription = result?.rows.length
    ? (result.rows[0] as OrbisDBRow<Subscription>)
    : null;
  // console.log("Subscription: ", subscription);
  return subscription;
};

export const updateSubscription = async (subscription: Subscription) => {
  const isNew = true;
  let statement: InsertStatement | UpdateByIdStatement | null = null;
  const { author, reader } = subscription;
  const existingSubscription = await fetchSubscription({ author, reader });
  if (existingSubscription) {
    // console.log("Updating subscription");
    statement = orbisdb
      .update(existingSubscription.stream_id)
      .set(subscription);
  } else {
    statement = orbisdb.insert(models.subscriptions).value(subscription);
    const validation = await statement.validate();
    if (!validation.valid) {
      throw new Error(
        `Error during subscription validation: ${validation.error}`,
      );
    }
  }

  const [result, error] = await catchError(() => statement?.run());
  if (error) throw new Error(`Error during subscription: ${error}`);
  if (!result) throw new Error("No result was returned from orbis");
  return result;
};
