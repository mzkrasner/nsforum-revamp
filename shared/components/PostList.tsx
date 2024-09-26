"use client";

import PostCard from "@/shared/components/PostCard";
import { Button } from "@/shared/components/ui/button";
import usePostList from "@/shared/hooks/usePostList";
import { FetchPostsOptions } from "@/shared/orbis/queries";
import { InfiniteData } from "@tanstack/react-query";
import { ReactNode } from "react";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { OrbisDBRow } from "../types";
import { Post } from "../types/post";

type Props = {
  fetchPostsOptions?: FetchPostsOptions;
  emptyContent?: ReactNode;
  initialData?: InfiniteData<OrbisDBRow<Post>[], number>;
  tags?: string[];
};
const PostList = ({
  fetchPostsOptions,
  emptyContent,
  initialData,
  tags,
}: Props) => {
  const { posts, postListQuery } = usePostList({
    fetchPostsOptions,
    initialData,
    tags,
  });
  const { hasNextPage, isFetching, fetchNextPage } = postListQuery;

  const { ref: infiniteScrollRef } = useInfiniteScroll({
    observerOptions: {
      threshold: 0,
    },
    hasNextPage,
    fetchNextPage,
  });

  return (
    <div>
      <ul>
        {posts.map((post, i) => {
          return (
            <li key={i} className="mb-5">
              <PostCard post={post} />
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
      {!posts.length &&
        !isFetching &&
        (emptyContent || (
          <div className="py-10 text-center text-neutral-500">
            No post found
          </div>
        ))}
    </div>
  );
};
export default PostList;
