"use server";

import { connectDbWithSeed } from "@/app/api/_orbis";
import { fetchCategorySuggestion } from "@/app/api/_orbis/queries";
import { checkAdminAuth } from "@/shared/actions/auth";
import { models, orbisdb } from "@/shared/orbis";
import { CategorySchema } from "@/shared/schema/category";
import { GenericCeramicDocument, OrbisDBRow } from "@/shared/types";
import {
  Category,
  CategorySuggestion,
  CategorySuggestionStatus,
} from "@/shared/types/category";
import { ilike } from "@useorbis/db-sdk/operators";
import { catchError } from "@useorbis/db-sdk/util";

export const updateCategorySuggestionStatus = async (
  id: string,
  status: CategorySuggestionStatus,
) => {
  const isAdmin = await checkAdminAuth();
  if (!isAdmin) {
    throw new Error("Unauthorized");
  }

  const categorySuggestion = await fetchCategorySuggestion(id);
  if (!categorySuggestion) throw new Error("Suggestion does not exist");

  await connectDbWithSeed();
  const statement = orbisdb.update(id).set({ status });
  const [result, error] = await catchError(() => statement?.run());
  if (error) throw new Error(`Error during subscription: ${error}`);
  return result as GenericCeramicDocument<CategorySuggestion>;
};

export const acceptCategorySuggestion = async (id: string) => {
  const isAdmin = await checkAdminAuth();
  if (!isAdmin) {
    throw new Error("Unauthorized");
  }

  const categorySuggestion = await fetchCategorySuggestion(id);
  if (!categorySuggestion) throw new Error("Suggestion does not exist");

  await connectDbWithSeed();
  const statement = orbisdb.insert(models.categories.id).value({
    name: categorySuggestion.name,
    description: categorySuggestion.description,
  });
  const validation = await statement.validate();
  if (!validation.valid) {
    throw new Error(
      `Error during category suggestion validation: ${validation.error}`,
    );
  }

  const [result, error] = await catchError(() => statement.run());
  if (error)
    throw new Error(`Error during category suggestion creation: ${error}`);

  if (result) {
    return await updateCategorySuggestionStatus(id, "accepted");
  }
};

const fetchCatgoryByName = async (name: string) => {
  const statement = orbisdb
    .select("stream_id")
    .from(models.categories.id)
    .where({ name: ilike(name) });
  const [result, error] = await catchError(() => statement?.run());
  if (error) throw new Error(`Error while fetching category: ${error}`);
  if (!result?.rows.length) return null;
  const category = result.rows[0] as OrbisDBRow<Category>;
  return category;
};

export const createCategory = async (categoryData: CategorySchema) => {
  const isAdmin = await checkAdminAuth();
  if (!isAdmin) {
    throw new Error("Unauthorized");
  }

  const existingCategory = await fetchCatgoryByName(categoryData.name);
  if (existingCategory) throw new Error("Category already exists");

  const statement = orbisdb.insert(models.categories.id).value(categoryData);
  const validation = await statement.validate();
  if (!validation.valid) {
    throw new Error(`Error during category validation: ${validation.error}`);
  }

  await connectDbWithSeed();
  const [result, error] = await catchError(() => statement.run());
  if (error) throw new Error(`Error during category creation: ${error}`);

  return result;
};

export const editCategory = async ({
  stream_id,
  ...categoryData
}: CategorySchema & { stream_id: string }) => {
  const isAdmin = await checkAdminAuth();
  if (!isAdmin) {
    throw new Error("Unauthorized");
  }

  const existingCategory = await fetchCatgoryByName(categoryData.name);
  if (existingCategory) throw new Error("Category already exists");

  const statement = orbisdb.update(stream_id).set(categoryData);

  await connectDbWithSeed();
  const [result, error] = await catchError(() => statement.run());
  if (error) throw new Error(`Error during category update: ${error}`);

  return result;
};
