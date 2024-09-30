import { contexts } from ".";
import { OrbisDBRow } from "../types";
import models from "./models";
import schemas from "./schemas";

export type Schema = typeof schemas;

export type Models = typeof models;

export type ModelName = keyof Models;

export type ModelSchema = Schema[keyof Schema];

export type Contexts = typeof contexts;

export type ContextValue = Contexts[keyof Contexts];

export type ColumnName<T extends Record<string, any>> =
  | Extract<keyof OrbisDBRow<T>, string>
  | string;
