"use server";

import { PrivyClient } from "@privy-io/server-auth";
import { isServer } from "@tanstack/react-query";
import { cookies } from "next/headers";

const privy = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!,
);

const getAuthTokenClaim = async () => {
  if (!isServer) return null;

  const cookieStore = cookies();
  const privyCookie = cookieStore.get("privy-token");
  if (!privyCookie) return null;
  const { value: token } = privyCookie;

  try {
    return await privy.verifyAuthToken(token);
  } catch (error) {
    console.log(`Token verification failed with error ${error}.`);
    return false;
  }
};

export const checkAdminAuth = async () => {
  if (!isServer) return null;

  try {
    const authTokenClaim = await getAuthTokenClaim();
    if (!authTokenClaim) return false;

    const userId = authTokenClaim.userId.replace("did:privy:", "");
    const adminIds = JSON.parse(process.env.ADMIN_DIDS! || "[]") || [];
    return adminIds.includes(userId);
  } catch (error) {
    console.log(`Admin auth verification failed with error ${error}.`);
    return false;
  }
};

export const getCurrentUser = async () => {
  try {
    const authTokenClaim = await getAuthTokenClaim();
    if (!authTokenClaim) return null;
    const userId = authTokenClaim.userId;
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
};

export const isUserVerified = async () => {
  try {
    const user = await getCurrentUser();
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
