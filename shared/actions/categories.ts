"use server";

import { connectDbWithSeed } from "@/app/api/_orbis";
import { findRow, insertRow } from "@/shared/orbis/utils";
import { CategorySuggestionSchema } from "@/shared/schema/categorySuggestion";
import { CategorySuggestion } from "@/shared/types/category";

export const suggestCategory = async (
  categorySuggestion: CategorySuggestionSchema,
) => {
  await connectDbWithSeed();
  return await insertRow<CategorySuggestion>({
    model: "categorySuggestions",
    value: { ...categorySuggestion, status: "pending" },
  });
};

export const fetchCategorySuggestion = async (id: string) => {
  return await findRow({
    model: "categorySuggestions",
    where: { stream_id: id },
  });
};
