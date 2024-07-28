import clsx from "clsx";
import { useEffect, useState } from "react";
import useHolo from "../hooks/useHolo";
import useSinglePost from "../hooks/useSinglePost";
import ProofOfPersonhoodModal from "./ProofOfPersonhoodModal";

export default function Upvote({ postId }) {
  const [showProofofPersonhoodModal, setShowProofofPersonhoodModal] =
    useState(false);

  const { isUnique, fetching, refreshProofOfPersonhood } = useHolo();

  const {
    post,
    reactToPostMutation,
    reactionQuery,
    loading: postLoading,
  } = useSinglePost({
    postId,
  });

  useEffect(() => {
    if (isUnique && showProofofPersonhoodModal) {
      setShowProofofPersonhoodModal(false);
    }
  }, [isUnique, showProofofPersonhoodModal]);

  // only allow users with proof of personhood to react
  const guardReaction = (fn) => {
    if (isUnique) return () => fn();
    return () => setShowProofofPersonhoodModal(true);
  };

  const like = () => reactToPostMutation.mutate("like");
  const downvote = () => reactToPostMutation.mutate("downvote");

  const loading =
    reactionQuery.isLoading || reactToPostMutation.isPending || postLoading;
  const reacting = reactToPostMutation.isPending;
  const liked = reactionQuery.data === "like";
  const downvoted = reactionQuery.data === "downvote";

  return (
    <>
      {showProofofPersonhoodModal && (
        <ProofOfPersonhoodModal
          closeModal={() => setShowProofofPersonhoodModal(false)}
          recheck={refreshProofOfPersonhood}
          checking={fetching}
          isUnique={isUnique}
        />
      )}
      <div
        className={clsx("ml-4 flex h-fit flex-col rounded-md border p-4 py-2", {
          "pointer-events-none opacity-50": loading || reacting || fetching,
          "text-brand border-brand": liked || downvoted,
          "text-primary border-primary cursor-pointer": !liked && !downvoted,
        })}
      >
        <button onClick={guardReaction(like)}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="transparent"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"
              fill={liked ? "currentColor" : "transparent"}
              stroke="currentColor"
              strokeLinejoin="round"
              className="stroke-[0.5] hover:fill-current hover:stroke-1"
            />
          </svg>
        </button>
        <div className="my-2 text-center font-medium">{post?.count_likes}</div>
        <button onClick={guardReaction(downvote)}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="transparent"
            xmlns="http://www.w3.org/2000/svg"
            className="rotate-180"
          >
            <path
              d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"
              fill={downvoted ? "currentColor" : "transparent"}
              stroke="currentColor"
              strokeLinejoin="round"
              className="stroke-[0.5] hover:fill-current hover:stroke-1"
            />
          </svg>
        </button>
      </div>
    </>
  );
}
