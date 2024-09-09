"use client";

import CategorySelector from "@/shared/components/CategorySelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useSearchParams } from "next/navigation";
import useCategories from "../hooks/useCategories";
import useUpdateQueryParams from "../hooks/useUpdateQueryParams";

type Props = { category?: boolean };
const PostFilters = ({ category = true }: Props) => {
  const updateQueryParams = useUpdateQueryParams();

  const searchParams = useSearchParams();
  const selectedCategoryId = searchParams.get("category");

  const { categories } = useCategories();
  const selectedCategory = selectedCategoryId
    ? categories.find((c) => c.stream_id === selectedCategoryId)
    : undefined;

  return (
    <div className="flex items-center gap-3">
      {category && (
        <CategorySelector
          label="All categories"
          selectedCategory={selectedCategory}
          onSelect={(category) => {
            updateQueryParams({
              category:
                category.stream_id === "all" ? null : category.stream_id,
            });
          }}
          categories={[
            {
              name: "All categories",
              description: "Posts from all categories",
              stream_id: "all",
            },
            ...categories,
          ]}
        />
      )}
      <Select
        defaultValue={searchParams.get("sortBy") || undefined}
        onValueChange={(sortBy) =>
          updateQueryParams({
            sortBy,
          })
        }
      >
        <SelectTrigger className="h-9">
          <SelectValue placeholder="Sort by" className="mr-3" />
        </SelectTrigger>
        <SelectContent>
          {/* <SelectItem value="most_upvoted">Most Upvoted</SelectItem> */}
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
export default PostFilters;
