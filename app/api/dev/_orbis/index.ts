import { orbisdb } from "@/shared/orbis";
import { parseDidSeed } from "@/shared/orbis/utils";
import { OrbisKeyDidAuth } from "@useorbis/db-sdk/auth";

export const connectDbWithExternalSeed = async (seedString: string) => {
  try {
    const connectedUser = await orbisdb.getConnectedUser();
    if (connectedUser && connectedUser.user.did) {
      return connectedUser.user.did;
    }

    const seed = JSON.parse(seedString);
    const auth = await OrbisKeyDidAuth.fromSeed(parseDidSeed(seed));
    const authInfo = await orbisdb.connectUser({ auth });
    if (authInfo?.user?.did) {
      return authInfo.user.did;
    } else {
      throw new Error("Could not connect to database");
    }
  } catch (error: unknown) {
    console.error(error);
    throw error as Error;
  }
};
