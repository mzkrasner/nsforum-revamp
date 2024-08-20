// Orbis queries on the frontend

import { models } from "../orbis";
import { catchError } from "../orbis/utils";
import { Profile } from "../schema/profile";
import useOrbis from "./useOrbis";

const useOrbisQueries = () => {
  const orbis = useOrbis();

  const fetchProfile = async (did?: string) => {
    if (!did || !orbis) return null;
    const selectStatement = orbis.select(models.profiles).where({ did })
    const [result, error] = await catchError(() => selectStatement?.run());
    if (error) throw new Error(`Error while fetching profile: ${error}`);
    if (!result?.rows.length)
      throw new Error(`Error while fetching profile: Profile not found`);
    const profile = result.rows[0] as Profile;
    return profile;
  }

  return { fetchProfile }
}

export default useOrbisQueries