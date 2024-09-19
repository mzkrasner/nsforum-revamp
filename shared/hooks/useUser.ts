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
    queryKey: ["subscription-data", { did }],
    queryFn: async () => {
      return await fetchSubscriptionData({
        author_did: did,
        reader_did: profile?.controller as string,
      });
    },
    enabled: !!profile?.controller,
  });

  const updateSubscriptionFn = async (subscribed: boolean) => {
    if (isNil(subscribed)) return null;
    return await updateSubscription({
      author_did: did,
      subscribed,
    });
  };

  const updateSubscriptionMutation = useMutation({
    mutationKey: ["update-subscription", { did }],
    mutationFn: updateSubscriptionFn,
    onSuccess: (data?: GenericCeramicDocument<Subscription> | null) => {
      if (!data?.content) return;
      const { subscribed } = data.content;
      queryClient.setQueryData(
        ["subscription-data", { did }],
        (staleSubscriptionData: SubscriptionData | undefined) =>
          produce(staleSubscriptionData, (draft) => {
            if (!isNil(draft?.subscriberCount)) {
              const { subscriberCount } = draft;
              draft.subscriberCount = +subscriberCount + (subscribed ? 1 : -1);
            }
            if (!isNil(draft?.subscription?.subscribed)) {
              draft.subscription.subscribed = subscribed;
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
    },
    onError: console.error,
  });

  return {
    user: query.data,
    query,
    isSubscribed: subscriptionDataQuery.data?.subscription?.subscribed,
    subscribedToCount: subscriptionDataQuery.data?.subscribedToCount,
    subscriberCount: subscriptionDataQuery.data?.subscriberCount,
    subscriptionDataQuery,
    updateSubscriptionMutation,
  };
};

export default useUser;
