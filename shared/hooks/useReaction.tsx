import useProfile from "@/shared/hooks/useProfile";
import { Reaction, ReactionModel } from "@/shared/types/reactions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { reactToContent } from "../actions/reactions";
import { fetchReactionTypeCounts } from "../orbis/queries";
import { findRow } from "../orbis/utils";
import { OrbisDBRow } from "../types";
import useOrbis from "./useOrbis";

type ReactionData = {
  reaction: OrbisDBRow<Reaction>;
  upvotes: number;
  downvotes: number;
};

type Props = {
  contentId?: string;
  model: ReactionModel;
};
const useReaction = ({ contentId, model }: Props) => {
  const queryClient = useQueryClient();

  const { profile } = useProfile();
  const userId = profile?.stream_id;

  const { authInfo } = useOrbis();
  const did = authInfo?.user.did;

  const [content_id, user_id] = [contentId, userId];

  const queryKey = ["reaction", { contentId, userId }];
  const reactionDataQuery = useQuery({
    queryKey,
    queryFn: async () => {
      if (!content_id || !user_id) return null;
      const reaction = await findRow<Reaction>({
        model: "reactions",
        where: { content_id, user_id, model },
      });
      const reactionTypeCounts = await fetchReactionTypeCounts({
        model,
        content_id,
      });

      return {
        reaction,
        ...reactionTypeCounts,
      } as ReactionData;
    },
    enabled: !!did,
  });
  const reactionData = reactionDataQuery.data;
  const { upvotes = 0, downvotes = 0, reaction } = reactionData || {};

  const updateReactionQuery = (newReactionData: ReactionData) => {
    queryClient.setQueryData(
      queryKey,
      produce((staleData: ReactionData) => {
        if (staleData && newReactionData) {
          Object.assign(staleData, newReactionData);
        }
      }),
    );
  };

  const upvoteMutation = useMutation({
    mutationKey: ["upvote", { content_id, user_id }],
    mutationFn: async () => {
      if (!content_id || !user_id) return null;
      const res = await reactToContent({
        content_id,
        user_id,
        type: reaction?.type === "upvote" ? "none" : "upvote",
        model,
      });
      const reactionTypeCounts = await fetchReactionTypeCounts({
        model,
        content_id,
      });

      return {
        reaction: res.content,
        ...reactionTypeCounts,
      } as ReactionData;
    },
    onSuccess: (newReactionData) => {
      if (!newReactionData) return;
      updateReactionQuery(newReactionData);
    },
  });

  const downvoteMutation = useMutation({
    mutationKey: ["downvote", { content_id, user_id }],
    mutationFn: async () => {
      if (!content_id || !user_id) return null;
      const res = await reactToContent({
        content_id,
        user_id,
        type: reaction?.type === "downvote" ? "none" : "downvote",
        model,
      });
      const reactionTypeCounts = await fetchReactionTypeCounts({
        model,
        content_id,
      });

      return {
        reaction: res.content,
        ...reactionTypeCounts,
      } as ReactionData;
    },
    onSuccess: (newReactionData) => {
      if (!newReactionData) return;
      updateReactionQuery(newReactionData);
    },
  });

  const { type } = reaction || {};
  const upvoted = type === "upvote";
  const downvoted = type === "downvote";

  return {
    reactionDataQuery,
    reaction,
    upvoted,
    downvoted,
    upvotes,
    downvotes,
    upvoteMutation,
    downvoteMutation,
  };
};

export default useReaction;
