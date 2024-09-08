import { Button } from "@/shared/components/ui/button";
import useProfile from "@/shared/hooks/useProfile";
import { cn } from "@/shared/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import usePost from "../_hooks/usePost";
import usePostReaction from "../_hooks/usePostReaction";

const PostReactions = () => {
  const { profile } = useProfile();
  const { post } = usePost();

  const {
    reactionQuery,
    reactionCounterQuery,
    upvotePostMutation,
    downvotePostMutation,
  } = usePostReaction();

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

  const isPending =
    upvotePostMutation.isPending || downvotePostMutation.isPending;

  return (
    <div className="flex items-center justify-center pt-5">
      <div className="flex w-fit flex-col items-center gap-1 text-sm text-neutral-600">
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-8 w-8 p-0", { "text-neutral-400": !upvoted })}
          onClick={() => upvotePostMutation.mutate()}
          loading={upvotePostMutation.isPending}
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
          onClick={() => downvotePostMutation.mutate()}
          loading={downvotePostMutation.isPending}
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
