"use server";

import { PrivyClient } from "@privy-io/server-auth";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";

const privy = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!,
);

const getAuthTokenClaims = async () => {
  const cookieStore = cookies();
  const privyCookie = cookieStore.get("privy-token");
  if (!privyCookie) return null;
  const { value: token } = privyCookie;

  try {
    const verifyAuthToken = unstable_cache(
      async () => await privy.verifyAuthToken(token),
      undefined,
      {
        tags: ["auth-token-claims"],
        revalidate: 60 * 5,
      },
    );
    return await verifyAuthToken();
  } catch (error) {
    console.log(`Token verification failed with error ${error}.`);
    return false;
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
    const adminIds: string[] =
      JSON.parse(process.env.ADMIN_DIDS! || "[]") || [];
    return adminIds.includes(userId);
  } catch (error) {
    console.log(`Admin auth verification failed with error ${error}.`);
    return false;
  }
};

export const getCurrentPrivyUser = unstable_cache(
  async () => {
    try {
      const authTokenClaims = await getAuthTokenClaims();
      if (!authTokenClaims) return null;
      const userId = authTokenClaims.userId;
      const privy = new PrivyClient(
        process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
        process.env.PRIVY_APP_SECRET!,
      );
      const user = await privy.getUser(userId);
      return user;
    } catch (error) {
      console.log(`Error while getting current user: ${error}`);
      return null;
    }
  },
  undefined,
  { tags: ["current-privy-user"], revalidate: 60 * 5 },
);

export const isUserVerified = async () => {
  try {
    const user = await getCurrentPrivyUser();
    const linkedAccounts = user?.linkedAccounts || [];
    for (const acct of linkedAccounts) {
      if (["phone", "twitter_oauth"].includes(acct.type)) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.log(`Error while checking user verification: ${error}`);
    return null;
  }
};
