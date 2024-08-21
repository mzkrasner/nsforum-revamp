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
  noReplies?: boolean;
};
const CommentList = ({
  fetchCommentsOptions,
  emptyContent,
  noReplies = false,
}: Props) => {
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
              <CommentCard comment={comment} noReplies={noReplies} />
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
            className="mx-auto flex"
            loading={true}
            loadingText="Loading comments..."
            loaderProps={{ className: "text-primary" }}
          />
        )}
      </InfiniteScroll>
      {!comments.length &&
        !isLoading &&
        (emptyContent || (
          <div className="py-10 text-center text-neutral-500">
            No comment found
          </div>
        ))}
    </div>
  );
};
export default CommentList;
