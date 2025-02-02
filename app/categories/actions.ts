"use client";

import { fetchCategorySuggestion } from "@/shared/orbis/queries";
import { findRow, insertRow, updateRow } from "@/shared/orbis/utils";
import { CategorySchema } from "@/shared/schema/category";
import {
  Category,
  CategorySuggestion,
  CategorySuggestionStatus,
} from "@/shared/types/category";
import { ilike } from "@useorbis/db-sdk/operators";

export const updateCategorySuggestionStatus = async (
  id: string,
  status: CategorySuggestionStatus,
) => {
  const categorySuggestion = await fetchCategorySuggestion(id);
  if (!categorySuggestion) throw new Error("Suggestion does not exist");

  return await updateRow<CategorySuggestion>({ id, set: { status } });
};

export const acceptCategorySuggestion = async (id: string) => {
  const categorySuggestion = await fetchCategorySuggestion(id);
  if (!categorySuggestion) throw new Error("Suggestion does not exist");

  const categoryData = {
    name: categorySuggestion.name,
    description: categorySuggestion.description,
  };

  const result = await insertRow({ model: "categories", value: categoryData });

  if (result) {
    return await updateCategorySuggestionStatus(id, "accepted");
  }
};

const fetchCatgoryByName = async (name: string) => {
  return await findRow<Category>({
    model: "categories",
    select: ["stream_id"],
    where: { name: ilike(name) },
  });
};

export const createCategory = async (categoryData: CategorySchema) => {

  const existingCategory = await fetchCatgoryByName(categoryData.name);
  if (existingCategory) {
    throw new Error("Category already exists");
  }

  return await insertRow({ model: "categories", value: categoryData });
};

export const editCategory = async ({
  stream_id,
  ...categoryData
}: CategorySchema & { stream_id: string }) => {

  return await updateRow({ id: stream_id, set: categoryData });
};
