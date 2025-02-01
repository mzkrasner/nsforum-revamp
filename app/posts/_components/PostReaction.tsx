import { Button } from "@/shared/components/ui/button";
import VerificationModal from "@/shared/components/VerificationModal";
import useProfile from "@/shared/hooks/useProfile";
import useReaction from "@/shared/hooks/useReaction";
import { cn } from "@/shared/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";
import usePost from "../_hooks/usePost";

const PostReaction = () => {
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  const { profile } = useProfile();
  const { post } = usePost();
  // const { isVerified } = useAuth();

  const {
    reactionDataQuery,
    upvoted,
    downvoted,
    upvotes,
    downvotes,
    upvoteMutation,
    downvoteMutation,
  } = useReaction({ contentId: post?.stream_id, model: "posts" });

  const guardReaction = (fn: Function, type: string) => () => {
    console.log(type, "guardReaction");
    fn();
  };

  const isDisabled =
    !post ||
    reactionDataQuery.isLoading ||
    upvoteMutation.isPending ||
    downvoteMutation.isPending;

  const isAuthor = profile?.controller === post?.controller;

  return (
    <div className="flex items-center justify-center py-5">
      <VerificationModal
        open={isVerificationModalOpen}
        onOpenChange={setIsVerificationModalOpen}
      />
      <div className="flex w-fit flex-col items-center gap-1 text-sm text-neutral-600">
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-8 w-8 p-0", { "text-neutral-400": !upvoted })}
          onClick={guardReaction(upvoteMutation.mutate, "upvote")}
          loading={upvoteMutation.isPending}
          loadingText=""
          loaderProps={{ className: "text-neutral-600" }}
          disabled={isDisabled || !profile || isAuthor}
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
          onClick={guardReaction(downvoteMutation.mutate, "downvote")}
          loading={downvoteMutation.isPending}
          loadingText=""
          loaderProps={{ className: "text-neutral-600" }}
          disabled={isDisabled || !profile || isAuthor}
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
export default PostReaction;
