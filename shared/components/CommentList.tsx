"use client";

import { ReactNode } from "react";
import useCommentList from "../hooks/useCommentList";
import { FetchCommentsArg } from "../orbis/queries";
import CommentCard from "./CommentCard";
import { Button } from "./ui/button";
import { InfiniteScroll } from "./ui/infinite-scroll";

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
  const { hasNextPage, isLoading, fetchNextPage } = commentListQuery;

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
