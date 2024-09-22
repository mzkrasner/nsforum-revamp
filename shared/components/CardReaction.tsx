import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import useProfile from "../hooks/useProfile";
import useReaction from "../hooks/useReaction";
import { cn } from "../lib/utils";
import { OrbisDBRow } from "../types";
import { CommentType } from "../types/comment";
import { Post } from "../types/post";
import { ReactionModel } from "../types/reactions";
import { Button } from "./ui/button";
import VerificationModal from "./VerificationModal";

type Props = {
  content: OrbisDBRow<CommentType | Post>;
  model: ReactionModel;
};
const CardReaction = ({ content, model }: Props) => {
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  const { profile } = useProfile();
  const { isVerified } = useAuth();

  const {
    reactionDataQuery,
    upvoted,
    downvoted,
    upvotes,
    downvotes,
    upvoteMutation,
    downvoteMutation,
  } = useReaction({ contentId: content.stream_id, model });

  if (reactionDataQuery.isLoading) return null;

  const guardReaction = (fn: Function) => () => {
    if (!isVerified) {
      setIsVerificationModalOpen(true);
      return;
    }
    fn();
  };

  const isPending = upvoteMutation.isPending || downvoteMutation.isPending;
  const isAuthor = profile?.controller === content.controller;

  return (
    <div className="flex items-center gap-1">
      <VerificationModal
        open={isVerificationModalOpen}
        onOpenChange={setIsVerificationModalOpen}
      />
      <Button
        variant="ghost"
        size="sm"
        className={cn("h-6 w-6 p-0", { "text-neutral-400": !downvoted })}
        onClick={guardReaction(downvoteMutation.mutate)}
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
        onClick={guardReaction(upvoteMutation.mutate)}
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
export default CardReaction;
