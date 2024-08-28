import { orbisdb } from "@/shared/orbis";
import { parseDidSeed } from "@/shared/orbis/utils";
import { OrbisKeyDidAuth } from "@useorbis/db-sdk/auth";

export const connectDb = async (seedString: string) => {
  const isConnected = await orbisdb.isUserConnected();
  if (isConnected) return;
  const seed = JSON.parse(seedString);
  const auth = await OrbisKeyDidAuth.fromSeed(parseDidSeed(seed));
  return await orbisdb.connectUser({ auth });
};
