"use server";

import { connectDbWithSeed } from "@/app/api/_orbis";
import { fetchCategorySuggestion } from "@/app/api/_orbis/queries";
import { checkAdminAuth } from "@/shared/actions/auth";
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
  const isAdmin = await checkAdminAuth();
  if (!isAdmin) {
    throw new Error("Unauthorized");
  }

  const categorySuggestion = await fetchCategorySuggestion(id);
  if (!categorySuggestion) throw new Error("Suggestion does not exist");

  await connectDbWithSeed();
  return await updateRow<CategorySuggestion>({ id, set: { status } });
};

export const acceptCategorySuggestion = async (id: string) => {
  const isAdmin = await checkAdminAuth();
  if (!isAdmin) {
    throw new Error("Unauthorized");
  }

  const categorySuggestion = await fetchCategorySuggestion(id);
  if (!categorySuggestion) throw new Error("Suggestion does not exist");

  await connectDbWithSeed();

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
  const isAdmin = await checkAdminAuth();
  if (!isAdmin) {
    throw new Error("Unauthorized");
  }

  await connectDbWithSeed();

  const existingCategory = await fetchCatgoryByName(categoryData.name);
  if (existingCategory) throw new Error("Category already exists");

  return await insertRow({ model: "categories", value: categoryData });
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

  await connectDbWithSeed();

  return await updateRow({ id: stream_id, set: categoryData });
};
