"use server";

import { env } from "@/env";
import { orbisdb } from "@/shared/orbis";
import { parseDidSeed } from "@/shared/orbis/utils";
import { OrbisKeyDidAuth } from "@useorbis/db-sdk/auth";

export const connectDbWithSeed = async () => {
  try {
    const connectedUser = await orbisdb.getConnectedUser();
    if (connectedUser && connectedUser.user.did) {
      return connectedUser;
    }

    const seed = JSON.parse(env.ORBIS_SEED as string);
    const auth = await OrbisKeyDidAuth.fromSeed(parseDidSeed(seed));
    const authInfo = await orbisdb.connectUser({ auth });
    if (authInfo?.user?.did) {
      return authInfo;
    } else {
      throw new Error("Could not connect to database");
    }
  } catch (error: unknown) {
    console.error(error);
    throw error as Error;
  }
};
