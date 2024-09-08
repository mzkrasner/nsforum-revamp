import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import useProfile from "../hooks/useProfile";
import useReaction from "../hooks/useReaction";
import { cn } from "../lib/utils";
import { OrbisDBRow } from "../types";
import { CommentType } from "../types/comment";
import { Button } from "./ui/button";

type Props = {
  comment: OrbisDBRow<CommentType>;
};
const CommentReaction = ({ comment }: Props) => {
  const { profile } = useProfile();
  const isAuthor = profile?.controller === comment.controller;

  const {
    reactionQuery,
    reactionCounterQuery,
    upvoteMutation,
    downvoteMutation,
  } = useReaction({ contentId: comment.stream_id, model: "comments" });

  if (reactionCounterQuery.isLoading || reactionQuery.isLoading) return null;

  const { type } = reactionQuery.data || { type: "none" };
  const upvoted = type === "upvote";
  const downvoted = type === "downvote";
  const { upvotes, downvotes } = reactionCounterQuery.data || {
    upvotes: 0,
    downvotes: 0,
  };

  const isPending = upvoteMutation.isPending || downvoteMutation.isPending;

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className={cn("h-6 w-6 p-0", { "text-neutral-400": !downvoted })}
        onClick={() => downvoteMutation.mutate()}
        loading={downvoteMutation.isPending}
        loadingText=""
        loaderProps={{ className: "text-neutral-600" }}
        disabled={isPending || !profile || isAuthor}
      >
        <ChevronLeftIcon
          size={downvoted ? 18 : 16}
          strokeWidth={downvoted ? 2.5 : 1.4}
          className={"text-neutral-500"}
        />
      </Button>
      <span>{+upvotes - +downvotes}</span>
      <Button
        variant="ghost"
        size="sm"
        className={cn("h-6 w-6 p-0", { "text-neutral-400": !upvoted })}
        onClick={() => upvoteMutation.mutate()}
        loading={upvoteMutation.isPending}
        loadingText=""
        loaderProps={{ className: "text-neutral-600" }}
        disabled={isPending || !profile || isAuthor}
      >
        <ChevronRightIcon
          size={upvoted ? 18 : 16}
          strokeWidth={upvoted ? 2.5 : 1.4}
          className={"text-neutral-500"}
        />
      </Button>
    </div>
  );
};
export default CommentReaction;
