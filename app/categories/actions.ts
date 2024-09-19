"use server";

import { suggestCategory } from "@/shared/actions/categories";
import { categorySuggestionSchema } from "@/shared/schema/categorySuggestion";
import { GenericCeramicDocument } from "@/shared/types";
import { CategorySuggestion } from "@/shared/types/category";
import { connectDbWithSeed } from "../api/_orbis";

// Handle when suggestion exists

export type FormState = {
  message: string;
  fields?: Record<string, string | undefined | null>;
  issues?: string[];
  data?: GenericCeramicDocument<CategorySuggestion>;
};

export async function onSuggestCategory(
  prevState: FormState,
  data: FormData,
): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsed = categorySuggestionSchema.safeParse(formData);

  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(formData)) {
      fields[key] = formData[key].toString();
    }
    return {
      message: "Invalid form data",
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
    };
  }

  // suggest a category
  await connectDbWithSeed();
  const res = await suggestCategory(parsed.data);

  return {
    message: "Your suggestion has been registered",
    data: res,
    fields: parsed.data,
  };
}
