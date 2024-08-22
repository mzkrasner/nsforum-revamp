import { OrbisDBRow } from ".";

export type Subscription = {
  author: string;
  reader: string;
  subscribed: string;
}

export   type SubscriptionData = {
  subscription: OrbisDBRow<Subscription> | null;
  subscribedToCount: number;
  subscriberCount: number;
};