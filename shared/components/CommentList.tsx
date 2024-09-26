"use client";

import { ReactNode } from "react";
import useCommentList from "../hooks/useCommentList";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { FetchCommentsArg } from "../orbis/queries";
import CommentCard from "./CommentCard";
import { Button } from "./ui/button";

type Props = {
  fetchCommentsArg: FetchCommentsArg;
  emptyContent?: ReactNode;
  noReplies?: boolean;
  parentIds?: string[];
};
const CommentList = ({
  fetchCommentsArg,
  emptyContent,
  noReplies = false,
  parentIds = [],
}: Props) => {
  const { comments, commentListQuery } = useCommentList({ fetchCommentsArg });
  const { hasNextPage, isFetching, fetchNextPage } = commentListQuery;

  const { ref: infiniteScrollRef } = useInfiniteScroll({
    observerOptions: {
      threshold: 0,
    },
    hasNextPage,
    fetchNextPage,
  });

  return (
    <div>
      <ul className="flex flex-col gap-3">
        {comments.map((comment, index) => {
          return (
            <li key={index}>
              <CommentCard
                comment={comment}
                noReplies={noReplies}
                parentIds={parentIds}
                fetchCommentsArg={fetchCommentsArg}
              />
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
      {!comments.length &&
        !isFetching &&
        (emptyContent || (
          <div className="py-10 text-center text-neutral-500">
            No comment found
          </div>
        ))}
    </div>
  );
};
export default CommentList;
