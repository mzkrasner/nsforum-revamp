import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { produce } from "immer";
import { isNil } from "lodash-es";
import { models } from "../orbis";
import { catchError } from "../orbis/utils";
import { OrbisDBRow } from "../types";
import { Profile } from "../types/profile";
import { Subscription } from "../types/subscription";
import useOrbis from "./useOrbis";
import useProfile from "./useProfile";

type Props = {
  did: string;
};

const useUser = ({ did }: Props) => {
  const queryClient = useQueryClient();

  const { profile } = useProfile();
  const { db } = useOrbis();

  const fetchUser = async () => {
    if (!did || !db) return null;
    const selectStatement = db.select().from(models.profiles).where({
      controller: did,
    });
    const [result, error] = await catchError(() => selectStatement?.run());
    if (error) throw new Error(`Error while fetching user: ${error}`);
    if (!result?.rows.length) return null;
    const user = result.rows[0];
    return user;
  };

  const query = useQuery({
    queryKey: ["user", { did }],
    queryFn: fetchUser,
  });

  const fetchSubscription = async () => {
    const { data } = await axios.get<OrbisDBRow<Subscription> | null>(
      "/api/subscription",
      {
        params: { author: did, reader: profile?.controller },
      },
    );
    // console.log("Fetch subscription data: ", data);
    return data || null;
  };

  const subscriptionQuery = useQuery({
    queryKey: ["subscription", { did }],
    queryFn: fetchSubscription,
    enabled: !!profile?.controller,
  });

  const updateSubscriptionFn = async (subscribed: boolean) => {
    if (isNil(subscribed)) return;
    const { data } = await axios.post(`/api/subscription`, {
      author: did,
      reader: profile?.controller,
      subscribed,
    });
    // console.log("Update subscription data: ", data);
    return data as Subscription;
  };

  const updateSubscriptionMutation = useMutation({
    mutationKey: ["update-subscription", { did }],
    mutationFn: updateSubscriptionFn,
    onSuccess: (data?: Subscription) => {
      if (!data) return;
      const queryKey = ["subscription", { did }];
      queryClient.setQueryData(queryKey, data);
      // queryClient.invalidateQueries({ queryKey });
      queryClient.setQueryData(["user", { did }], (staleUser: Profile) =>
        produce(staleUser, (draft) => {
          if (data.subscribed) {
            draft.followers = Number(draft.followers) + 1;
          } else {
            draft.followers = Number(draft.followers) - 1;
          }
        }),
      );
      if (profile) {
        queryClient.setQueryData(["profile"], (staleProfile: Profile) =>
          produce(staleProfile, (draft) => {
            if (data.subscribed) {
              draft.following = Number(draft.following) + 1;
            } else {
              draft.following = Number(draft.following) - 1;
            }
          }),
        );
      }
    },
    onError: console.error,
  });

  return {
    user: query.data,
    query,
    subscriptionQuery,
    updateSubscriptionMutation,
  };
};

export default useUser;
