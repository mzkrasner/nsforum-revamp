import { OrbisDB } from "@useorbis/db-sdk";
import { OrbisKeyDidAuth } from "@useorbis/db-sdk/auth";


const db = new OrbisDB({
  ceramic: {
    gateway: "https://ceramic-orbisdb-mainnet-direct.hirenodes.io/",
  },
  nodes: [
    {
      gateway: "https://studio.useorbis.com",
      env: process.env.NEXT_PUBLIC_ORBIS_ENVIRONMENT_ID
    },
  ],
});


const run = async () => {
    const seed = await OrbisKeyDidAuth.generateSeed();

    const auth = await OrbisKeyDidAuth.fromSeed(seed);

    await db.connectUser({ auth });

      console.log({
      ORBIS_SEED: JSON.stringify(Array.from(seed)),
      NEXT_PUBLIC_APP_DID: db.ceramic.did.id
    });
 
  }

run();
