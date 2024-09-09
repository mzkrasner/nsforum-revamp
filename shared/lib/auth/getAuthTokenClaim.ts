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

export default getAuthTokenClaim;
