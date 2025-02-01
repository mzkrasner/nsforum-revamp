"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import CategorySelector from "@/shared/components/CategorySelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import useCategories from "../hooks/useCategories";
import { SortPostOption } from "../types/post";

type Props = { category?: boolean; defaultSortBy?: SortPostOption };

const PostFilters = ({ category = true, defaultSortBy = "newest" }: Props) => {
  const pathname = usePathname(); // Get current path (without query)
  const searchParams = useSearchParams();

  // ✅ Store category in state to trigger re-renders
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    searchParams.get("category")
  );

  const { categories } = useCategories();
  const selectedCategory = selectedCategoryId
    ? categories.find((c) => c.stream_id === selectedCategoryId)
    : undefined;

  // ✅ Sync state when searchParams change
  useEffect(() => {
    setSelectedCategoryId(searchParams.get("category"));
  }, [searchParams]);

  // ✅ Function to update URL query params
  const updateQueryParams = (newCategoryId: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newCategoryId) {
      params.set("category", newCategoryId);
    } else {
      params.delete("category");
    }

    window.location.href = `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex items-center gap-3">
      {category && (
        <CategorySelector
          label="All categories"
          selectedCategory={selectedCategory}
          onSelect={(category) => {
            const newCategoryId = category.stream_id === "all" ? null : category.stream_id;
            setSelectedCategoryId(newCategoryId); // ✅ Update state to force re-render
            updateQueryParams(newCategoryId);
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
        defaultValue={searchParams.get("sortBy") || defaultSortBy}
        onValueChange={(sortBy) =>
          updateQueryParams(sortBy)
        }
      >
      </Select>
    </div>
  );
};

export default PostFilters;
