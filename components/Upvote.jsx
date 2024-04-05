import clsx from "clsx";
import useHolo from "../hooks/useHolo";
import { useEffect, useState } from "react";
import ProofofPersonhoodModal from "./ProofofPersonhoodModal";

export default function Upvote({
  loading,
  like,
  downvote,
  reacting,
  liked,
  downvoted,
  count,
}) {
  const [showProofofPersonhoodModal, setShowProofofPersonhoodModal] =
    useState(false);

  const { isUnique, fetching, refreshProofOfPersonhood } = useHolo();

  useEffect(() => {
    if (isUnique && showProofofPersonhoodModal) {
      setShowProofofPersonhoodModal(false);
    }
  }, [isUnique]);

  // only allow users with proof of personhood to react
  const guardReaction = (fn) => {
    if (isUnique) return () => fn();
    return () => setShowProofofPersonhoodModal(true);
  };

  return (
    <>
      {showProofofPersonhoodModal && (
        <ProofofPersonhoodModal
          closeModal={() => setShowProofofPersonhoodModal(false)}
          recheck={refreshProofOfPersonhood}
          checking={fetching}
          isUnique={isUnique}
        />
      )}
      <div
        className={clsx("h-fit rounded-md border p-4 py-2 ml-4 flex flex-col", {
          "opacity-50 pointer-events-none": loading || reacting || fetching,
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
              className="stroke-[0.5] hover:stroke-1 hover:fill-current"
            />
          </svg>
        </button>
        <div className="font-medium text-center my-2">{count}</div>
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
              className="stroke-[0.5] hover:stroke-1 hover:fill-current"
            />
          </svg>
        </button>
      </div>
    </>
  );

  if (liked) {
    return (
      <div
        className={clsx(
          "rounded-md border text-brand border-brand p-4 py-2 mr-4 flex flex-col",
          { "opacity-50 pointer-events-none": loading }
        )}
      >
        <svg
          width="16"
          height="13"
          viewBox="0 0 16 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.840583 10.7C0.210872 11.6989 0.92869 13 2.10947 13L13.8906 13C15.0714 13 15.7892 11.6989 15.1595 10.7L9.26893 1.35638C8.68048 0.422985 7.3196 0.422987 6.73115 1.35638L0.840583 10.7Z"
            fill="currentColor"
          />
        </svg>
        <div className="font-bold text-center mt-1">{count}</div>
      </div>
    );
  } else {
    return (
      <div
        className={clsx(
          "rounded-md border text-primary border-primary hover-border-secondary p-4 py-2 mr-4 cursor-pointer flex-col",
          { "opacity-50 pointer-events-none": loading }
        )}
        onClick={() => like()}
      >
        <svg
          width="16"
          height="14"
          viewBox="0 0 16 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.840461 10.7C0.210749 11.6989 0.928568 13 2.10935 13L13.8905 13C15.0713 13 15.7891 11.6989 15.1594 10.7L9.26881 1.35638C8.68036 0.422985 7.31948 0.422987 6.73103 1.35638L0.840461 10.7Z"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />
        </svg>
        <div className="font-medium text-center mt-1">{count}</div>
      </div>
    );
  }
}
