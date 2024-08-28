// Orbis queries on the frontend

import { catchError } from "@useorbis/db-sdk/util";
import { models } from "../orbis";
import useOrbis from "./useOrbis";

const useOrbisQueries = () => {
  const { db } = useOrbis();

  const fetchProfile = async (did?: string) => {
    if (!did || !db) return null;
    const selectStatement = db.select(models.users.id).where({ did });
    const [result, error] = await catchError(() => selectStatement?.run());
    if (error) throw new Error(`Error while fetching profile: ${error}`);
    if (!result?.rows.length)
      throw new Error(`Error while fetching profile: Profile not found`);
    const profile = result.rows[0];
    return profile;
  };

  return { fetchProfile };
};

export default useOrbisQueries;
