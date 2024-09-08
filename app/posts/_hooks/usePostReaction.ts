import useProfile from "@/shared/hooks/useProfile";
import { fetchReaction, fetchReactionCounter } from "@/shared/orbis/queries";
import { OrbisDBRow } from "@/shared/types";
import {
  Reaction,
  ReactionCounter,
  ReactionModel,
} from "@/shared/types/reactions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { reactToContent } from "../actions";
import usePost from "./usePost";

const usePostReaction = () => {
  const queryClient = useQueryClient();

  const { profile } = useProfile();
  const userId = profile?.stream_id;

  const { post } = usePost();
  const { stream_id: postId } = post || {};

  const [content_id, user_id, model] = [
    postId,
    userId,
    "posts" as ReactionModel,
  ];

  const reactionQueryKey = ["reaction", { postId, userId }];
  const reactionQuery = useQuery({
    queryKey: reactionQueryKey,
    queryFn: async () => {
      if (!content_id || !user_id) return null;
      return await fetchReaction({ content_id, user_id });
    },
  });

  const updateReactionQuery = (newReactionData: Partial<Reaction>) => {
    queryClient.setQueryData(
      reactionQueryKey,
      produce((staleData: OrbisDBRow<Reaction>) => {
        if (staleData) Object.assign(staleData, newReactionData);
      }),
    );
  };

  const reactionCounterQueryKey = ["reaction_counter", { postId }];
  const reactionCounterQuery = useQuery({
    queryKey: reactionCounterQueryKey,
    queryFn: async () => {
      if (!content_id) return null;
      return await fetchReactionCounter({ content_id, model });
    },
  });

  const updateReactionCounterQuery = (newCounterData: ReactionCounter) => {
    queryClient.setQueryData(
      reactionCounterQueryKey,
      produce((staleData: OrbisDBRow<ReactionCounter>) => {
        if (staleData) Object.assign(staleData, newCounterData);
      }),
    );
  };

  const upvotePostMutation = useMutation({
    mutationKey: ["upvote-post", { postId }],
    mutationFn: async () => {
      if (!content_id || !user_id) return null;
      return await reactToContent({
        content_id,
        user_id,
        type: "upvote",
        model,
      });
    },
    onSuccess: (res) => {
      if (!res) return;
      updateReactionCounterQuery(res.content);
      updateReactionQuery({
        type: reactionQuery.data?.type === "upvote" ? "none" : "upvote",
      });
    },
  });

  const downvotePostMutation = useMutation({
    mutationKey: ["downvote-post", { postId }],
    mutationFn: async () => {
      if (!content_id || !user_id) return null;
      return await reactToContent({
        content_id,
        user_id,
        type: "downvote",
        model,
      });
    },
    onSuccess: (res) => {
      if (!res) return;
      updateReactionCounterQuery(res.content);
      updateReactionQuery({
        type: reactionQuery.data?.type === "downvote" ? "none" : "downvote",
      });
    },
  });

  return {
    reactionQuery,
    reactionCounterQuery,
    upvotePostMutation,
    downvotePostMutation,
  };
};

export default usePostReaction;
