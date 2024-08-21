import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { models } from "../orbis";
import { catchError } from "../orbis/utils";
import { ProfileFormType } from "../schema/profile";
import { OrbisDBRow } from "../types";
import { Profile } from "../types/profile";
import useOrbis from "./useOrbis";

const useProfile = () => {
  const router = useRouter();

  const queryClient = useQueryClient();

  const { db, authInfo } = useOrbis();

  const fetchProfile = async (did?: string) => {
    if (!did || !db) return null;
    const selectStatement = db
      .select()
      .from(models.profiles)
      .where({ controller: did });
    const [result, error] = await catchError(() => selectStatement?.run());
    if (error) throw new Error(`Error while fetching profile: ${error}`);
    if (!result?.rows.length) return null;
    const profile = result.rows[0] as OrbisDBRow<Profile>;
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
    if (!db || !authInfo) return;

    const did = authInfo.user.did;
    let statement;
    const existingProfile = await fetchProfile(did);
    // console.log("Existing profile: ", existingProfile);
    if (existingProfile?.stream_id) {
      // console.log("Updating profile");
      // Update
      statement = db.update(existingProfile.stream_id).set(values);
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

  return { profile: query.data, query, saveMutation };
};

export default useProfile;
