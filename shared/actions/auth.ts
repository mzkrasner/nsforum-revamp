"use server";

import { env } from "@/env";
import { PrivyClient } from "@privy-io/server-auth";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";

const privy = new PrivyClient(
  env.NEXT_PUBLIC_PRIVY_APP_ID!,
  env.PRIVY_APP_SECRET!,
);

const getAuthTokenClaims = async () => {
  const cookieStore = cookies();
  const privyCookie = cookieStore.get("privy-token");
  if (!privyCookie) return null;
  const { value: token } = privyCookie;

  try {
    const verifyAuthToken = unstable_cache(
      async () => await privy.verifyAuthToken(token),
      [token],
      {
        tags: ["auth-token-claims"],
        revalidate: 60 * 5,
      },
    );
    return await verifyAuthToken();
  } catch (error) {
    console.error(`Token verification failed with error ${error}.`);
    return null;
  }
};

export const getCurrentPrivyUserId = async () => {
  const authTokenClaims = await getAuthTokenClaims();
  if (!authTokenClaims) return null;
  return authTokenClaims.userId;
};

export const checkAdminAuth = async () => {
  try {
    const authTokenClaims = await getAuthTokenClaims();
    if (!authTokenClaims) return false;

    const userId = authTokenClaims.userId.replace("did:privy:", "");
    const adminIds: string[] = JSON.parse(env.ADMIN_PRIVY_IDS! || "[]") || [];
    return adminIds.includes(userId);
  } catch (error) {
    console.error(`Admin auth verification failed with error ${error}.`);
    return false;
  }
};

export const getCurrentPrivyUser = async (userId: string) => {
  try {
    if (!userId) return null;
    const privy = new PrivyClient(
      env.NEXT_PUBLIC_PRIVY_APP_ID!,
      env.PRIVY_APP_SECRET!,
    );
    const user = await privy.getUser(userId);
    return user;
  } catch (error) {
    console.error(`Error while getting current user: ${error}`);
    return null;
  }
};

export const isUserVerified = async () => {
  try {
    const authTokenClaims = await getAuthTokenClaims();
    const userId = authTokenClaims?.userId;
    if (!userId) return false;

    const user = await unstable_cache(getCurrentPrivyUser, [userId], {
      tags: ["current-privy-user"],
      revalidate: 60 * 5,
    })(userId);

    const linkedAccounts = user?.linkedAccounts || [];
    for (const acct of linkedAccounts) {
      if (["phone", "twitter_oauth"].includes(acct.type)) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error(`Error while checking user verification: ${error}`);
    return null;
  }
};
