"use client";

import { Button } from "@/shared/components/ui/button";
import { SearchIcon } from "lucide-react";

import PostCard from "@/shared/components/PostCard";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import useInfiniteScroll from "@/shared/hooks/useInfiniteScroll";
import usePostList from "@/shared/hooks/usePostList";
import { escapeSQLLikePattern } from "@/shared/lib/utils";
import { ilike } from "@useorbis/db-sdk/operators";
import { useRef, useState } from "react";
import { useDebounce } from "use-debounce";

const Search = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const cmdListRef = useRef<HTMLDivElement>(null);

  const { posts, postListQuery } = usePostList({
    fetchPostsOptions: {
      filter: {
        title: ilike(`%${escapeSQLLikePattern(debouncedSearchTerm)}%`),
      },
    },
  });

  const { isFetching, hasNextPage, fetchNextPage } = postListQuery;

  const { ref: infiniteScrollRef } = useInfiniteScroll({
    observerOptions: {
      threshold: 0,
      root: cmdListRef.current,
    },
    hasNextPage,
    fetchNextPage,
  });

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="ml-auto flex items-center justify-start gap-2 text-sm text-gray-500 md:w-full md:max-w-[140px]"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="w-4" />
        <span className="hidden md:inline">Search...</span>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        commandProps={{ shouldFilter: false }}
      >
        <CommandInput
          placeholder="Search..."
          value={searchTerm}
          onChangeCapture={(e: any) => setSearchTerm(e.target.value)}
          onFocus={() => setOpen(true)}
        />
        <CommandList ref={cmdListRef} className="h-fit">
          <ScrollArea>
            <CommandGroup
              heading={isFetching ? "" : `${posts.length} posts found`}
            >
              <div className="grid grid-cols-1 gap-y-3">
                {!!searchTerm &&
                  posts.map((post, i) => {
                    return (
                      <CommandItem key={i} className="!p-0">
                        <PostCard
                          post={post}
                          className="w-full"
                          onClick={() => setOpen(false)}
                        />
                      </CommandItem>
                    );
                  })}
                {isFetching ? (
                  <CommandItem className="mb-4 flex items-center justify-center">
                    <Button
                      variant="ghost"
                      loading={true}
                      loadingText="Searching..."
                      loaderProps={{ className: "text-neutral-700" }}
                      className="mx-auto w-fit"
                    />
                  </CommandItem>
                ) : (
                  <CommandEmpty>No results found.</CommandEmpty>
                )}
              </div>
            </CommandGroup>
            <CommandGroup className="flex items-center justify-center">
              <div ref={infiniteScrollRef}></div>
            </CommandGroup>
          </ScrollArea>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default Search;
