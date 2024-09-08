import { Button } from "@/shared/components/ui/button";
import useProfile from "@/shared/hooks/useProfile";
import useReaction from "@/shared/hooks/useReaction";
import { cn } from "@/shared/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import usePost from "../_hooks/usePost";

const PostReactions = () => {
  const { profile } = useProfile();
  const { post } = usePost();

  const {
    reactionQuery,
    reactionCounterQuery,
    upvoteMutation,
    downvoteMutation,
  } = useReaction({ contentId: post?.stream_id, model: "posts" });

  if (
    !post ||
    !profile ||
    reactionCounterQuery.isLoading ||
    reactionQuery.isLoading
  )
    return null;

  const { type } = reactionQuery.data || { type: "none" };
  const upvoted = type === "upvote";
  const downvoted = type === "downvote";
  const { upvotes, downvotes } = reactionCounterQuery.data || {
    upvotes: 0,
    downvotes: 0,
  };

  const isPending = upvoteMutation.isPending || downvoteMutation.isPending;

  return (
    <div className="flex items-center justify-center pt-5">
      <div className="flex w-fit flex-col items-center gap-1 text-sm text-neutral-600">
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-8 w-8 p-0", { "text-neutral-400": !upvoted })}
          onClick={() => upvoteMutation.mutate()}
          loading={upvoteMutation.isPending}
          loadingText=""
          loaderProps={{ className: "text-neutral-600" }}
          disabled={isPending}
        >
          <ChevronUpIcon
            size={upvoted ? 24 : 18}
            strokeWidth={upvoted ? 3 : 2}
          />
        </Button>
        <span>{+upvotes - +downvotes}</span>
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-8 w-8 p-0", { "text-neutral-400": !downvoted })}
          onClick={() => downvoteMutation.mutate()}
          loading={downvoteMutation.isPending}
          loadingText=""
          loaderProps={{ className: "text-neutral-600" }}
          disabled={isPending}
        >
          <ChevronDownIcon
            size={downvoted ? 24 : 18}
            strokeWidth={downvoted ? 3 : 2}
          />
        </Button>
      </div>
    </div>
  );
};
export default PostReactions;
