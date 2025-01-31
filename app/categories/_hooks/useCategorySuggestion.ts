import { FetchCategorySuggestionsOptions } from "@/shared/orbis/queries";
import { GenericCeramicDocument, OrbisDBRow } from "@/shared/types";
import { Category, CategorySuggestion } from "@/shared/types/category";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { produce } from "immer";
import {
  acceptCategorySuggestion,
  updateCategorySuggestionStatus,
} from "../actions";

const useCategorySuggestion = ({
  id,
  fetchOptions,
}: {
  id: string;
  fetchOptions?: FetchCategorySuggestionsOptions;
}) => {
  const queryClient = useQueryClient();

  const onUpdateCategorySuggestions = (
    response?: GenericCeramicDocument<CategorySuggestion>,
  ) => {
    if (!response?.id || !fetchOptions?.filter?.status) return;
    queryClient.invalidateQueries({ queryKey: ["category-suggestions"] });
    queryClient.setQueriesData(
      {
        queryKey: ["admin", "category-suggestions", fetchOptions],
      },
      produce(
        (
          suggestions?: InfiniteData<OrbisDBRow<CategorySuggestion>[], unknown>,
        ) => {
          if (!suggestions || !fetchOptions.filter?.status) return;
          const { pages } = suggestions;
          outerLoop: for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            for (let j = 0; j < page.length; j++) {
              const suggestion = page[j];
              if (
                suggestion.stream_id === id &&
                response.content.status !== fetchOptions.filter?.status
              ) {
                pages[i].splice(j, 1);
                break outerLoop;
              }
            }
          }
        },
      ),
    );
  };

  const acceptCategorySuggestionMutation = useMutation({
    mutationKey: ["accept-category-suggestion", { id }],
    mutationFn: async () => {
      if (!id) throw new Error("No category suggestion id");
      return await acceptCategorySuggestion(id);
    },
    onSuccess: (response) => {
      if (!response) return;
      const { content, controller } = response;

      onUpdateCategorySuggestions(response);
      // Add category
      queryClient.setQueryData(
        ["categories", undefined],
        produce((draft: InfiniteData<OrbisDBRow<Category>[]>) => {
          if (response.content) {
            draft.pages[draft.pages.length - 1].push({
              ...content,
              controller,
              stream_id: id,
              indexed_at: new Date().toISOString(),
            });
          }
        }),
      );
    },
  });

  const rejectCategorySuggestionMutation = useMutation({
    mutationKey: ["reject-category-suggestion", { id }],
    mutationFn: async () => {
      if (!id) throw new Error("No category suggestion id");
      return await updateCategorySuggestionStatus(id, "rejected");
    },
    onSuccess: onUpdateCategorySuggestions,
  });

  return { acceptCategorySuggestionMutation, rejectCategorySuggestionMutation };
};

export default useCategorySuggestion;
