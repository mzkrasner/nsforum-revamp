import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { findRow, insertRow, updateRow } from "../orbis/utils";
import { ProfileFormType } from "../schema/profile";
import { OrbisDBRow } from "../types";
import { Profile } from "../types/profile";
import { SubscriptionData } from "../types/subscription";
import useOrbis from "./useOrbis";

const useProfile = () => {
  const router = useRouter();

  const queryClient = useQueryClient();

  const { authInfo } = useOrbis();
  const did = authInfo?.user.did;

  const fetchProfile = async (did?: string) => {
    if (!did) return null;
    const profile = await findRow<Profile>({
      model: "users",
      where: { controller: did },
    });
    return profile;
  };

  const profileQuery = useQuery({
    queryKey: ["profile", { did }],
    queryFn: async () => {
      return await fetchProfile(did);
    },
    enabled: !!did,
  });

  const fetchSubscriptionData = async () => {
    const { data } = await axios.get<SubscriptionData>("/api/subscription", {
      params: { author: did, reader: did },
    });
    return data || null;
  };

  const subscriptionDataQuery = useQuery({
    queryKey: ["profile-subscription-data"],
    queryFn: fetchSubscriptionData,
    enabled: !!did,
  });

  const saveProfile = async (values: ProfileFormType) => {
    if (!did) return;

    const existingProfile = await fetchProfile(did);
    if (existingProfile?.stream_id) {
      const result = await updateRow<Profile>({
        id: existingProfile.stream_id,
        set: values,
      });
      return result;
    } else {
      const newProfile: Profile = {
        ...values,
        verified: false,
      };
      const result = await insertRow({
        model: "users",
        value: newProfile,
      });
      return result;
    }
  };

  const saveMutation = useMutation({
    mutationKey: ["save-profile"],
    mutationFn: saveProfile,
    onSuccess: (result) => {
      // console.log("Profile: ", result);
      if (!result) return;
      queryClient.setQueryData(
        ["profile"],
        (oldProfile?: OrbisDBRow<Profile>) => {
          const newProfile = {
            ...(oldProfile || {}),
            ...result.content, // TODO: Confirm this works
          };
          return newProfile;
        },
      );
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
      router.push("/profile");
    },
    onError: console.error,
  });

  return {
    profile: profileQuery.data,
    profileQuery,
    isSubscribed: subscriptionDataQuery.data?.subscription?.subscribed,
    subscribedToCount: subscriptionDataQuery.data?.subscribedToCount,
    subscriberCount: subscriptionDataQuery.data?.subscriberCount,
    subscriptionDataQuery,
    saveMutation,
  };
};

export default useProfile;
