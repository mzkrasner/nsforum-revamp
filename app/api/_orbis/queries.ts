import { models, orbisdb } from "@/shared/orbis";
import { OrbisDBRow } from "@/shared/types";
import { Subscription } from "@/shared/types/subscription";
import { count } from "@useorbis/db-sdk/operators";
import { InsertStatement, UpdateByIdStatement } from "@useorbis/db-sdk/query";
import { catchError } from "@useorbis/db-sdk/util";

export const fetchSubscription = async (
  query: Omit<Subscription, "subscribed">,
) => {
  if (!query.author || !query.reader) throw new Error("Invalid query");
  const selectStatement = orbisdb
    .select()
    .from(models.subscriptions.id)
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
  let statement: InsertStatement | UpdateByIdStatement | null = null;
  const { author, reader } = subscription;
  const existingSubscription = await fetchSubscription({ author, reader });
  if (existingSubscription) {
    // console.log("Updating subscription");
    statement = orbisdb
      .update(existingSubscription.stream_id)
      .set(subscription);
  } else {
    statement = orbisdb.insert(models.subscriptions.id).value(subscription);
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

export const fetchSubscribedToCount = async (did: string) => {
  const selectStatement = orbisdb
    .select(count("author", "count"))
    .from(models.subscriptions.id)
    .where({
      reader: did,
      subscribed: true,
    });
  const [result, error] = await catchError(() => selectStatement?.run());
  if (error)
    throw new Error(`Error while fetching subscribed to count: ${error}`);
  // console.log("Subscribed to count result: ", result);
  return Number(result.rows.length ? result.rows[0].count : 0);
};

export const fetchSubscriberCount = async (did: string) => {
  const selectStatement = orbisdb
    .select(count("reader", "count"))
    .from(models.subscriptions.id)
    .where({
      author: did,
      subscribed: true,
    });
  const [result, error] = await catchError(() => selectStatement?.run());
  if (error)
    throw new Error(`Error while fetching subscribed to count: ${error}`);
  // console.log("Subscriber count result: ", result);
  return Number(result.rows.length ? result.rows[0].count : 0);
};

const fetchUserNotification = async (userId: string) => {
  const selectStatement = orbisdb.select().from(models.notifications.id).where({
    reader: userId,
  });
  const [result, error] = await catchError(() => selectStatement?.run());
  if (error)
    throw new Error(`Error while fetching user notification: ${error}`);
  return result.rows.length ? result.rows[0] : undefined;
};

type NotificationPost = {
  id: string;
  authorName: string;
  authorId: string;
};

type AddPostNotificationPayload = {
  readerId: string;
  authorId: string;
  authorName: string;
  postId: string;
};
export const addPostNotification = async ({
  readerId,
  authorId,
  authorName,
  postId,
}: AddPostNotificationPayload) => {
  // Fetch existing notification
  const existingNotification = await fetchUserNotification(readerId);
  const existingPosts: NotificationPost[] = existingNotification?.posts || [];

  const newPost: NotificationPost = {
    id: postId,
    authorName,
    authorId,
  };
  let statement;
  if (existingNotification) {
    // If exists update it
    // Check if it already exists
    const alreadyAdded = !!existingPosts.find(
      (p: { id: string }) => p.id === postId,
    );
    if (alreadyAdded) return true;

    statement = orbisdb
      .update(existingNotification.stream_id)
      .set({ posts: [...existingPosts, newPost] });
  } else {
    // Else create new one
    statement = orbisdb.insert(models.notifications.id).value(newPost);
    const validation = await statement.validate();
    if (!validation.valid) {
      throw new Error(
        `Validation error while creating a new notification in addPostNotification: ${validation.error}`,
      );
    }
  }

  const [result, error] = await catchError(() => statement?.run());
  if (error)
    throw new Error(`Error while updating notification with post: ${error}`);
  if (!result) throw new Error("No result was returned from orbis");
  return result;
};
