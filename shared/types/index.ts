import { CeramicDocument, DIDAny } from "@useorbis/db-sdk";
import { ORBIS_DB_FIELDS } from "../orbis/constants";

export type OnlyStringFields<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

export type OrbisDBRow<T extends Record<string, any>> = {
  controller: DIDAny | string;
  indexed_at: string;
  stream_id: string;
  // TODO: add plugins_data and _metadata_context type
} & T;

export type OrbisDBFields = (typeof ORBIS_DB_FIELDS)[number];

export type GenericCeramicDocument<T extends Record<string, any>> = Omit<
  CeramicDocument,
  "content"
> & { content: T };

// Utility type to get all elements of a tuple except the first one
type Tail<T extends any[]> = T extends [any, ...infer Rest] ? Rest : never;

// Example function type
// export type GenericFnArgTail<T extends any[]> = Tail<T>;
export type GenericFnArgTail<T extends (...args: any[]) => any> = T extends (
  first: any,
  ...rest: infer R
) => any
  ? R
  : never;
