import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { isNil } from "lodash-es";
import {
  fetchSubscriptionData,
  updateSubscription,
} from "../actions/subscriptions";
import { fetchUser } from "../orbis/queries";
import { GenericCeramicDocument, OrbisDBRow } from "../types";
import { Subscription } from "../types/subscription";
import useProfile from "./useProfile";

type Props = {
  did: string;
};

const useUser = ({ did }: Props) => {
  const queryClient = useQueryClient();

  const { profile } = useProfile();

  const query = useQuery({
    queryKey: ["user", { did }],
    queryFn: async () => await fetchUser({ controller: did }),
    enabled: !!did,
  });

  type SubscriptionData = {
    subscription: OrbisDBRow<Subscription> | null;
    subscribedToCount: number | string;
    subscriberCount: number | string;
  };

  const subscriptionDataQuery = useQuery({
    queryKey: [
      "subscription-data",
      { did, profileController: profile?.controller },
    ],
    queryFn: async () => {
      return await fetchSubscriptionData({
        author_did: did,
        reader_did: profile?.controller as string,
      });
    },
    enabled: !!profile?.controller && !!did,
  });

  const onSubscriptionDataUpdate = (
    data?: GenericCeramicDocument<Subscription> | null,
  ) => {
    if (!data?.content) return;

    const newSubscription = data.content;
    const { subscribed } = newSubscription;
    queryClient.setQueryData(
      ["subscription-data", { did }],
      (staleSubscriptionData: SubscriptionData | undefined) =>
        produce(staleSubscriptionData, (draft) => {
          if (
            !isNil(draft?.subscriberCount) &&
            draft.subscription &&
            draft.subscription.subscribed !== newSubscription.subscribed
          ) {
            const { subscriberCount } = draft;
            draft.subscriberCount = +subscriberCount + (subscribed ? 1 : -1);
          }
          if (!isNil(draft?.subscription)) {
            Object.assign(draft.subscription, newSubscription);
          }
        }),
    );
    queryClient.invalidateQueries({
      queryKey: ["subscription-data", { did }],
    });

    queryClient.setQueryData(
      ["profile-subscription-data"],
      (staleSubscriptionData: SubscriptionData | undefined) =>
        produce(staleSubscriptionData, (draft) => {
          if (!isNil(draft?.subscribedToCount)) {
            const { subscribedToCount } = draft;
            draft.subscribedToCount =
              +subscribedToCount + (subscribed ? 1 : -1);
          }
          if (!isNil(draft?.subscription?.subscribed)) {
            draft.subscription.subscribed = subscribed;
          }
        }),
    );
    queryClient.invalidateQueries({
      queryKey: ["profile-subscription-data"],
    });
  };

  const updateSubscriptionMutation = useMutation({
    mutationKey: ["update-subscription", { did }],
    mutationFn: async (subscribed: boolean) => {
      return await updateSubscription({
        reader_did: profile?.controller!,
        subscribed,
        post_notifications: true,
        author_did: did,
      });
    },
    onSuccess: onSubscriptionDataUpdate,
    onError: console.error,
  });

  const updatePostNotificationsMutation = useMutation({
    mutationKey: ["update-post-notifications", { did }],
    mutationFn: async (post_notifications: boolean) => {
      if (!profile?.controller) return;

      const subscribed = true;
      return await updateSubscription({
        reader_did: profile.controller,
        post_notifications,
        author_did: did,
        subscribed,
      });
    },
    onSuccess: onSubscriptionDataUpdate,
    onError: console.error,
  });

  return {
    user: query.data,
    query,
    subscriptionDataQuery,
    updateSubscriptionMutation,
    updatePostNotificationsMutation,
  };
};

export default useUser;
