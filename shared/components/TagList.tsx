"use client";

import useInfiniteScroll from "../hooks/useInfiniteScroll";
import useTags from "../hooks/useTags";
import { Button } from "./ui/button";

const TagList = () => {
  const { tags, tagsQuery } = useTags();
  const { hasNextPage, fetchNextPage } = tagsQuery;
  const { ref: infiniteScrollRef } = useInfiniteScroll({
    observerOptions: {
      threshold: 0,
    },
    hasNextPage,
    fetchNextPage,
  });

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const { stream_id, name } = tag;
          return (
            <Button
              key={stream_id}
              variant="outline"
              className="pointer-events-none"
            >
              {name}
            </Button>
          );
        })}
      </div>
      <div ref={infiniteScrollRef}></div>
    </div>
  );
};
export default TagList;
