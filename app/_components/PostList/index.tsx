"use client";

import PostCard from "@/shared/components/PostCard";
import { Button } from "@/shared/components/ui/button";
import { InfiniteScroll } from "@/shared/components/ui/infinite-scroll";
import Link from "next/link";
import PostFilters from "./components/PostFilters";
import usePostList from "./usePostList";

const PostList = () => {
  const { postListQuery } = usePostList();
  const { hasNextPage, isLoading, fetchNextPage } = postListQuery;
  const posts = postListQuery.data?.pages.map((page) => page).flat() || [];
  return (
    <section className="container">
      <div className="mb-5 flex items-center justify-between">
        <PostFilters />
        <Button size="sm" asChild>
          <Link href="/posts/new">Create Post</Link>
        </Button>
      </div>
      <ul>
        {posts.map((post, i) => {
          return (
            <li key={i} className="mb-5">
              <PostCard post={post} />
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
        {hasNextPage && (
          <Button
            variant="ghost"
            className="mx-auto flex"
            loading={true}
            loadingText="Loading..."
            loaderProps={{ className: "text-primary" }}
          />
        )}
      </InfiniteScroll>
      {!posts.length && (
        <div className="py-10 text-center text-neutral-500">No post found</div>
      )}
    </section>
  );
};
export default PostList;
