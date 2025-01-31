import {
  fetchCategorySuggestions,
  FetchCategorySuggestionsOptions,
} from "@/shared/orbis/queries";
import { useInfiniteQuery } from "@tanstack/react-query";

type Props = {
  fetchOptions?: FetchCategorySuggestionsOptions;
};

const useCategorySuggestionList = (props: Props) => {
  const { fetchOptions } = props || {};

  const categorySuggestionListQuery = useInfiniteQuery({
    queryKey: ["admin", "category-suggestions", fetchOptions],
    queryFn: ({ pageParam }) =>
      fetchCategorySuggestions({
        page: pageParam,
        ...fetchOptions,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length ? pages.length : undefined;
    },
  });

  const { data } = categorySuggestionListQuery;

  const categorySuggestions = data?.pages.map((page) => page).flat() || [];

  return { categorySuggestions, categorySuggestionListQuery };
};

export default useCategorySuggestionList;
