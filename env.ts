// src/env.mjs
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    ORBIS_SEED: z.string().refine(
      (str) => {
        try {
          const seed = JSON.parse(str);
          const parsed = z.array(z.number().int()).length(32).safeParse(seed);
          return parsed.success;
        } catch (error) {
          return false;
        }
      },
      { message: "ORBIS_SEED env variable must be an array of 32 integers" },
    ),
    BASE_URL: z.string().trim().min(1),
    PINATA_JWT: z.string().trim().min(1),
    OPENAI_API_KEY: z.string().trim().min(1),
    ORBIS_DB_AUTH_TOKEN: z.string().optional(),
  },
  /*
   * Environment variables available on the client (and server).
   *
   * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_SST_URL: z.string().optional(),
    NEXT_PUBLIC_ORBIS_ENVIRONMENT_ID: z.string().trim().min(1),
    NEXT_PUBLIC_APP_DID: z.string().trim().min(1),
    NEXT_PUBLIC_CERAMIC_NODE_URL: z.string().trim().min(1),
    NEXT_PUBLIC_ORBIS_NODE_URL: z.string().trim().min(1),
    NEXT_PUBLIC_GATEWAY_URL: z.string().trim().min(1),
    NEXT_PUBLIC_RPC_URL: z.string().trim().min(1),
  },
  shared: {
    NODE_ENV: z.enum(["test", "development", "production"]).optional(),
  },
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    ORBIS_DB_AUTH_TOKEN: process.env.ORBIS_DB_AUTH_TOKEN,
    ORBIS_SEED: process.env.ORBIS_SEED,
    BASE_URL: process.env.BASE_URL,
    PINATA_JWT: process.env.PINATA_JWT,
    NEXT_PUBLIC_SST_URL: process.env.NEXT_PUBLIC_SST_URL,
    NEXT_PUBLIC_ORBIS_ENVIRONMENT_ID:
      process.env.NEXT_PUBLIC_ORBIS_ENVIRONMENT_ID,
    NEXT_PUBLIC_APP_DID: process.env.NEXT_PUBLIC_APP_DID,
    NEXT_PUBLIC_CERAMIC_NODE_URL: process.env.NEXT_PUBLIC_CERAMIC_NODE_URL,
    NEXT_PUBLIC_ORBIS_NODE_URL: process.env.NEXT_PUBLIC_ORBIS_NODE_URL,
    NEXT_PUBLIC_GATEWAY_URL: process.env.NEXT_PUBLIC_GATEWAY_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_RPC_URL: process.env.NEXT_PUBLIC_RPC_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
});
