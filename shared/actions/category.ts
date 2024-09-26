"use server";

import { connectDbWithSeed } from "@/app/api/_orbis";
import { insertRow } from "../orbis/utils";
import { CategorySuggestionSchema } from "../schema/categorySuggestion";
import { CategorySuggestion } from "../types/category";

export const suggestCategory = async (
  categorySuggestion: CategorySuggestionSchema,
) => {
  await connectDbWithSeed();

  return await insertRow<CategorySuggestion>({
    model: "categorySuggestions",
    value: { ...categorySuggestion, status: "pending" },
  });
};
