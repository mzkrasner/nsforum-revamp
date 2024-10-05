import { catchError } from "@useorbis/db-sdk/util";
import { isNil } from "lodash-es";
import { contexts, models, orbisdb } from ".";
import { GenericCeramicDocument, OrbisDBRow } from "../types";
import { ColumnName, ContextValue, ModelName } from "./types";

export type InsertRowArg<T> = {
  model: ModelName;
  value: T;
  context?: ContextValue;
};
export const insertRow = async <T extends Record<string, any>>({
  model,
  value,
  context = contexts.root,
}: InsertRowArg<T>) => {
  const statement = orbisdb
    .insert(models[model].id)
    .value(value)
    .context(context);
  const validation = await statement.validate();
  if (!validation.valid) {
    throw new Error(
      `Error while validating insert data in ${model}: ${validation.error}`,
    );
  }
  const [result, error] = await catchError(() => statement.run());
  if (error) throw new Error(`Error while inserting row in ${model}: ${error}`);
  return JSON.parse(JSON.stringify(result)) as GenericCeramicDocument<
    typeof value
  >;
};

export type UpdateRowArg<T> = {
  id: string;
  set: Partial<T>;
};
export const updateRow = async <T extends Record<string, any>>({
  id,
  set,
}: UpdateRowArg<T>) => {
  const statement = orbisdb.update(id).set(set);
  const [result, error] = await catchError(() => statement?.run());
  if (error)
    throw new Error(`Error while updating document with id ${id}: ${error}`);
  return JSON.parse(JSON.stringify(result)) as GenericCeramicDocument<T>;
};

export type FetchRowsArg<T extends Record<string, any>> = {
  select?: (ColumnName<T> | any)[];
  model: ModelName;
  where?: Partial<Record<ColumnName<T>, any>>;
  limit?: number;
  offset?: number;
  orderBy?: [ColumnName<T>, "asc" | "desc"][];
};
export const fetchRows = async <T extends Record<string, any>>({
  select = [],
  model,
  where,
  limit,
  offset,
  orderBy,
}: FetchRowsArg<T>) => {
  let statement = orbisdb.select(...select).from(models[model].id);
  if (!isNil(where)) statement = statement.where(where);
  if (!isNil(limit)) statement = statement.limit(limit);
  if (!isNil(offset)) statement = statement.offset(offset);
  if (!isNil(orderBy)) statement = statement.orderBy(...orderBy);

  const [result, error] = await catchError(() => statement?.run());
  if (error) throw new Error(`Error while fetching posts: ${error}`);
  const rows = result.rows;
  return JSON.parse(JSON.stringify(rows)) as OrbisDBRow<T>[];
};

export type FetchRowsPageArg<T extends Record<string, any>> = Omit<
  FetchRowsArg<T>,
  "offset" | "limit"
> & { page?: number; pageSize?: number };
export const fetchRowsPage = async <T extends Record<string, any>>({
  page = 0,
  pageSize = 10,
  ...arg
}: FetchRowsPageArg<T>) => {
  const offset = page * pageSize;
  return await fetchRows({ ...arg, offset, limit: pageSize });
};

export type FindRowArg<T extends Record<string, any>> = Omit<
  FetchRowsArg<T>,
  "limit"
>;
export const findRow = async <T extends Record<string, any>>(
  arg: FindRowArg<T>,
) => {
  const result = await fetchRows({ ...arg, limit: 1 });
  if (result.length)
    return JSON.parse(JSON.stringify(result[0])) as OrbisDBRow<T>;
  return null;
};

export type UpsertRowArg<T extends Record<string, any>> = {
  query: Omit<FindRowArg<T>, "model" | "select">;
} & InsertRowArg<T>;
export const upsertRow = async <T extends Record<string, any>>({
  model,
  query,
  value,
  context,
}: UpsertRowArg<T>) => {
  const row = await findRow<T>({ ...query, model, select: ["stream_id"] });
  if (row?.stream_id) {
    return await updateRow<T>({ id: row.stream_id, set: value });
  }
  return await insertRow<T>({ model, value, context });
};

/** Parse a seed from string, or return if it's already in the right format */
export const parseDidSeed = (seed: string) => {
  const attemptJsonParse = (str: string) => {
    try {
      return JSON.parse(str);
    } catch {
      return false;
    }
  };

  const parsedSeed = attemptJsonParse(seed) || seed;

  if (typeof parsedSeed === "string") {
    if (!/^(0x)?[0-9a-f]+$/i.test(seed)) {
      throw "Invalid seed format. It's not a hex string or an array.";
    }
    return seed;
  }

  if (Array.isArray(parsedSeed)) {
    return new Uint8Array(parsedSeed);
  }

  if (parsedSeed instanceof Uint8Array) {
    return parsedSeed;
  }

  throw "Invalid seed format. It's not a hex string or an array.";
};

export const ceramicDocToOrbisRow = <T extends Record<string, any>>(
  ceramicDoc: GenericCeramicDocument<T>,
) => {
  const { id, content, controller, model, context } = ceramicDoc;
  return {
    stream_id: id,
    content,
    controller,
    model,
    context,
    ...ceramicDoc.content,
    indexed_at: new Date().toISOString(), // TODO: check out if you can get the actual date
  } as OrbisDBRow<T>;
};
