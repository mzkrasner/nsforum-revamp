"use client";

import { Button } from "@/shared/components/ui/button";
import useInfiniteScroll from "@/shared/hooks/useInfiniteScroll";
import { FetchCategorySuggestionsOptions } from "@/shared/orbis/queries";
import { ReactNode } from "react";
import useCategorySuggestionList from "../_hooks/useCategorySuggestionList";
import CategorySuggestionCard from "./CategorySuggestionCard";

type Props = {
  fetchOptions?: FetchCategorySuggestionsOptions;
  emptyContent?: ReactNode;
};
const CategorySuggestionList = ({
  fetchOptions,
  emptyContent = null,
}: Props) => {
  const { categorySuggestions, categorySuggestionListQuery } =
    useCategorySuggestionList({
      fetchOptions,
    });
  const { hasNextPage, isFetching, fetchNextPage } =
    categorySuggestionListQuery;
  console.log("has next page: ", hasNextPage);
  console.log("is fetching: ", isFetching);

  const { ref: infiniteScrollRef } = useInfiniteScroll({
    observerOptions: {
      threshold: 0,
    },
    hasNextPage,
    fetchNextPage,
  });

  return (
    <div>
      <ul className="md:grid md:grid-cols-2 md:gap-3">
        {categorySuggestions.map((categorySuggestion) => {
          return (
            <li key={categorySuggestion.stream_id}>
              <CategorySuggestionCard
                categorySuggestion={categorySuggestion}
                fetchOptions={fetchOptions}
              />
            </li>
          );
        })}
      </ul>
      <div ref={infiniteScrollRef}></div>
      {isFetching && (
        <Button
          variant="ghost"
          className="mx-auto flex gap-2"
          loading={true}
          loadingText="Loading..."
          loaderProps={{ className: "text-primary" }}
        />
      )}
      {!categorySuggestions.length &&
        !isFetching &&
        (emptyContent || (
          <div className="py-10 text-center text-neutral-500">
            No category suggestion found
          </div>
        ))}
    </div>
  );
};
export default CategorySuggestionList;
