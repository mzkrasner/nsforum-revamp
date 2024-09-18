"use client";

import { Button } from "@/shared/components/ui/button";
import { InfiniteScroll } from "@/shared/components/ui/infinite-scroll";
import { ReactNode } from "react";
import useCategories from "../hooks/useCategories";
import { OrbisDBRow } from "../types";
import { Category } from "../types/category";
import CategoryCard from "./CategoryCard";

type Props = {
  renderCategory?: (category: OrbisDBRow<Category>) => ReactNode;
  emptyContent?: ReactNode;
};
const CategoryList = ({ renderCategory, emptyContent }: Props) => {
  const { categories, categoriesListQuery } = useCategories();
  const { hasNextPage, isLoading, fetchNextPage } = categoriesListQuery;

  return (
    <div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {categories.map((category, i) => {
          return (
            <li key={i}>
              {renderCategory ? (
                renderCategory(category)
              ) : (
                <CategoryCard category={category} />
              )}
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
      {!categories.length &&
        !isLoading &&
        (emptyContent || (
          <div className="py-10 text-center text-neutral-500">
            No category found
          </div>
        ))}
    </div>
  );
};
export default CategoryList;