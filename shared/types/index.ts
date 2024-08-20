import { CeramicDocument, DIDAny } from "@useorbis/db-sdk";

export type OnlyStringFields<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

export type OrbisDBRow<T extends Record<string, any>> = {
  controller: DIDAny;
  indexed_at: string;
  stream_id: string;
  // TODO: add plugins_data and _metadata_context type
} & T;

export type GenericCeramicDocument<T extends Record<string, any>> = Omit<
  CeramicDocument,
  "content"
> & { content: T };
