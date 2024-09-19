"use server";

import { models } from "@/shared/orbis";
import { insertRow } from "@/shared/orbis/utils";
import { CategorySuggestionSchema } from "@/shared/schema/categorySuggestion";
import { CategorySuggestion } from "@/shared/types/category";
import axios from "axios";

export const suggestCategory = async (
  categorySuggestion: CategorySuggestionSchema,
) => {
  return await insertRow<CategorySuggestion>({
    model: "categorySuggestions",
    value: { ...categorySuggestion, status: "pending" },
  });
};

export const fetchCategorySuggestion = async (id: string) => {
  const graphql = `{
    ${models.categorySuggestions.name}(filter: { stream_id: "${id}" }) {
      stream_id
      name
      description
    }
  }
`;
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_ORBIS_NODE_URL}/global/graphql`,
    {
      query: graphql,
    },
  );
  const categorySuggestions: CategorySuggestion[] =
    data?.data?.[models.categorySuggestions.name] || [];
  return categorySuggestions.length ? categorySuggestions[0] : null;
};
