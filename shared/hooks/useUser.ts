import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { produce } from "immer";
import { isNil } from "lodash-es";
import { fetchUser } from "../orbis/queries";
import { OrbisDBRow } from "../types";
import { Subscription } from "../types/subscription";
import useProfile from "./useProfile";

type Props = {
  did: `did:${string}`;
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
  const fetchSubscriptionData = async () => {
    const { data } = await axios.get<SubscriptionData>("/api/subscription", {
      params: { author: did, reader: profile?.controller },
    });
    return data || null;
  };

  const subscriptionDataQuery = useQuery({
    queryKey: ["subscription-data", { did }],
    queryFn: fetchSubscriptionData,
    enabled: !!profile?.controller,
  });

  const updateSubscriptionFn = async (subscribed: boolean) => {
    if (isNil(subscribed)) return null;
    const { data } = await axios.post(`/api/subscription`, {
      author_did: did,
      reader_did: profile?.controller,
      subscribed,
    } as Subscription);
    return data as Subscription;
  };

  const updateSubscriptionMutation = useMutation({
    mutationKey: ["update-subscription", { did }],
    mutationFn: updateSubscriptionFn,
    onSuccess: (data?: Subscription | null) => {
      if (!data) return;
      const { subscribed } = data;
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
