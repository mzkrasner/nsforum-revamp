"use client";

import { Button } from "@/shared/components/ui/button";
import { InfiniteScroll } from "@/shared/components/ui/infinite-scroll";
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
  const { hasNextPage, isLoading, fetchNextPage } = categorySuggestionListQuery;

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
      <InfiniteScroll
        hasMore={hasNextPage}
        isLoading={isLoading}
        next={fetchNextPage}
        threshold={1}
      >
        {isLoading && (
          <Button
            variant="ghost"
            className="mx-auto flex gap-2"
            loading={true}
            loadingText="Loading..."
            loaderProps={{ className: "text-primary" }}
          />
        )}
      </InfiniteScroll>
      {!categorySuggestions.length &&
        !isLoading &&
        (emptyContent || (
          <div className="py-10 text-center text-neutral-500">
            No category suggestion found
          </div>
        ))}
    </div>
  );
};
export default CategorySuggestionList;
