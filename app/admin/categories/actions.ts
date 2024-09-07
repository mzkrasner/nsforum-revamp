"use server";

import { connectDbWithSeed } from "@/app/api/_orbis";
import { fetchCategorySuggestion } from "@/app/api/_orbis/queries";
import { models, orbisdb } from "@/shared/orbis";
import { CategorySchema } from "@/shared/schema/category";
import { GenericCeramicDocument } from "@/shared/types";
import {
  CategorySuggestion,
  CategorySuggestionStatus,
} from "@/shared/types/category";
import { catchError } from "@useorbis/db-sdk/util";

export const updateCategorySuggestionStatus = async (
  id: string,
  status: CategorySuggestionStatus,
) => {
  const categorySuggestion = await fetchCategorySuggestion(id);
  if (!categorySuggestion) throw new Error("Suggestion does not exist");

  await connectDbWithSeed();
  const statement = orbisdb.update(id).set({ status });
  const [result, error] = await catchError(() => statement?.run());
  if (error) throw new Error(`Error during subscription: ${error}`);
  return result as GenericCeramicDocument<CategorySuggestion>;
};

export const acceptCategorySuggestion = async (id: string) => {
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

export const createCategory = async (categoryData: CategorySchema) => {
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
  // TODO validate and check for existing category
  const statement = orbisdb.update(stream_id).set(categoryData);

  await connectDbWithSeed();
  const [result, error] = await catchError(() => statement.run());
  if (error) throw new Error(`Error during category update: ${error}`);

  return result;
};
