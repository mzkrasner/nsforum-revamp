import { OrbisDBFields } from "@/shared/types";
import schemas from ".";
import models from "../models";

export type Schema = typeof schemas;

export type Models = typeof models;

export type TableField<T extends keyof Schema> =
  | keyof Schema[T]["schema"]["properties"]
  | OrbisDBFields;

export type TableId<T extends keyof Models> = Models[T]["id"];

export type Relation<T extends keyof Schema, K extends keyof Schema> = {
  referenceName: Exclude<string, TableField<T>>;
  table: TableId<T>;
  column: TableField<T>;
  referencedColumn: TableField<K>;
  referencedTable: TableId<K>;
  referencedType: "single" | "list";
  index?: number;
};

export const subscriptionReaderRelation: Relation<"subscriptions", "users"> = {
  referenceName: "reader",
  table: models.subscriptions.id,
  column: "reader_did",
  referencedColumn: "controller",
  referencedTable: models.users.id,
  referencedType: "single",
};

export const notificationReaderRelation: Relation<"notifications", "users"> = {
  referenceName: "reader",
  table: models.notifications.id,
  column: "reader_did",
  referencedColumn: "controller",
  referencedTable: models.users.id,
  referencedType: "single",
};

export const notificationsPostsRelation: Relation<
  "notifications",
  "notifications"
> = {
  referenceName: "posts",
  table: models.notifications.id,
  column: "posts",
  referencedColumn: "posts",
  referencedTable: models.notifications.id,
  referencedType: "single",
};

export const notificationsCommentsRelation: Relation<
  "notifications",
  "notifications"
> = {
  referenceName: "comments",
  table: models.notifications.id,
  column: "comments",
  referencedColumn: "comments",
  referencedTable: models.notifications.id,
  referencedType: "single",
};

const relations = {
  subscriptionReaderRelation,
  notificationReaderRelation,
  notificationsPostsRelation,
  notificationsCommentsRelation,
} as const;

export default relations;
