"use client";

import PostCard from "@/shared/components/PostCard";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import useOutsideClick from "@/shared/hooks/useOutsideClick";
import usePostList from "@/shared/hooks/usePostList";
import { escapeSQLLikePattern } from "@/shared/lib/utils";
import { ilike } from "@useorbis/db-sdk/operators";
import { SearchIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useDebounce } from "use-debounce";

const Search = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const ref = useRef<HTMLDivElement | null>(null);
  useOutsideClick(ref, () => setOpen(false));

  const { posts, postListQuery } = usePostList({
    fetchPostsOptions: {
      filter: {
        title: ilike(`%${escapeSQLLikePattern(debouncedSearchTerm)}%`),
      },
    },
  });
  const { isLoading } = postListQuery;

  return (
    <div className="relative">
      <SearchIcon
        size={16}
        strokeWidth={1.5}
        className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-neutral-500"
      />
      <Input
        className="h-9 border-0 bg-neutral-100 pl-8 pr-3"
        placeholder="Search posts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setOpen(true)}
      />
      {open && searchTerm && (
        <>
          <div className="fixed left-0 top-20 z-10 h-[calc(100vh_-_80px)] w-full bg-black/10"></div>
          <div
            ref={ref}
            className="max-w-100vw fixed left-0 top-20 z-10 mx-8 w-[calc(100vw_-_80px)] sm:absolute sm:left-[unset] sm:right-0 sm:top-14 sm:mx-auto sm:w-fit sm:min-w-80 sm:p-0"
          >
            <ScrollArea className="h-fit">
              <ul className="flex flex-col gap-2 rounded-md">
                {isLoading ? (
                  <li className="flex items-center justify-center">
                    <Button
                      variant="ghost"
                      loading={true}
                      loadingText="Searching..."
                      loaderProps={{ className: "text-neutral-700" }}
                      className="mx-auto w-fit"
                    />
                  </li>
                ) : !posts.length ? (
                  <li className="text-center text-sm text-neutral-500">
                    No post found
                  </li>
                ) : (
                  posts.map((post, i) => {
                    return (
                      <li key={i}>
                        <PostCard post={post} onClick={() => setOpen(false)} />
                      </li>
                    );
                  })
                )}
              </ul>
            </ScrollArea>
          </div>
        </>
      )}
    </div>
  );
};

export default Search;
