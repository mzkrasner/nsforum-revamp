"use client";

import { ReactNode } from "react";
import useCommentList from "../hooks/useCommentList";
import { FetchCommentsOptions } from "../orbis/queries";
import CommentCard from "./CommentCard";
import { Button } from "./ui/button";
import { InfiniteScroll } from "./ui/infinite-scroll";

type Props = {
  fetchCommentsOptions: FetchCommentsOptions;
  emptyContent?: ReactNode;
};
const CommentList = (props: Props) => {
  const { fetchCommentsOptions, emptyContent } = props;
  const { commentListQuery } = useCommentList({ fetchCommentsOptions });
  const { hasNextPage, isLoading, fetchNextPage } = commentListQuery;
  const comments =
    commentListQuery.data?.pages.map((page) => page).flat() || [];
  return (
    <div>
      <ul className="flex flex-col gap-3">
        {comments.map((comment, index) => {
          return (
            <li key={index}>
              <CommentCard comment={comment} />
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
      {!comments.length &&
        (emptyContent || (
          <div className="py-10 text-center text-neutral-500">
            No comment found
          </div>
        ))}
    </div>
  );
};
export default CommentList;
