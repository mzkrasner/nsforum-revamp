import {
  fetchCategories,
  FetchCategoriesOptions,
} from "@/shared/orbis/queries";
import { useInfiniteQuery } from "@tanstack/react-query";

type Props = { fetchCategoriesOptions?: FetchCategoriesOptions };
const useCategories = (props?: Props) => {
  const { fetchCategoriesOptions } = props || {};

  const categoriesListQuery = useInfiniteQuery({
    queryKey: ["categories", fetchCategoriesOptions],
    queryFn: ({ pageParam }) =>
      fetchCategories({ page: pageParam, ...fetchCategoriesOptions }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length ? pages.length : undefined;
    },
  });

  const categories =
    categoriesListQuery.data?.pages.map((page) => page).flat() || [];

  return { categories, categoriesListQuery };
};

export default useCategories;
