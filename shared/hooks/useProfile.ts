import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CeramicDocument } from "@useorbis/db-sdk";
import { useRouter } from "next/navigation";
import { models } from "../orbis";
import { catchError } from "../orbis/utils";
import { ProfileFormType } from "../schema/profile";
import { Profile } from "../types/profile";
import useOrbis from "./useOrbis";

const useProfile = () => {
  const router = useRouter();

  const queryClient = useQueryClient();

  const { db, authInfo } = useOrbis();

  const fetchProfile = async (did?: string) => {
    if (!did || !db) return null;
    // console.log("Users table: ", models.profiles);
    const selectStatement = db
      .select()
      .from(models.profiles)
      .where({ controller: did });
    const [result, error] = await catchError(() => selectStatement?.run());
    if (error) throw new Error(`Error while fetching profile: ${error}`);
    if (!result?.rows.length) return null;
    const profile = result.rows[0] as Profile & CeramicDocument;
    return profile;
  };

  const query = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      return await fetchProfile(authInfo?.user.did);
    },
    enabled: !!authInfo?.user?.did,
  });

  const saveProfile = async (values: ProfileFormType) => {
    if (!db || !authInfo) {
      // console.log(query.isSuccess, orbis, authInfo);
      return;
    }

    const did = authInfo.user.did;
    let statement;
    const existingProfile = await fetchProfile(did);
    // console.log("Existing profile: ", existingProfile);
    if (existingProfile?.id) {
      // console.log("Updating profile");
      // Update
      statement = db.update(existingProfile.id).set(values);
    } else {
      // console.log("Creating new profile");
      // Create new
      const newProfile: Profile = {
        ...values,
        followers: 0,
        following: 0,
        verified: false,
      };
      statement = db.insert(models.profiles).value(newProfile);
      const validation = await statement.validate();
      if (!validation.valid) {
        throw new Error(
          `Error during create profile validation: ${validation.error}`,
        );
      }
    }
    // console.log("Running");
    const [result, error] = await catchError(() => statement.run());
    // console.log("Result: ", result);
    // console.log("Error", error);
    if (error) throw new Error(`Error during create profile query: ${error}`);
    if (!result) throw new Error("No result was returned from orbis");
    return result;
  };

  const saveMutation = useMutation({
    mutationKey: ["save-profile"],
    mutationFn: saveProfile,
    onSuccess: (result) => {
      // console.log("Profile: ", result);
      if (!result) return;
      // queryClient.setQueryData(["profile"], profile);
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
      router.push("/profile");
    },
    onError: console.error,
  });

  return { profile: query.data, query, saveMutation };
};

export default useProfile;
