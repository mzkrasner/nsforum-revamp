import { isServer } from "@tanstack/react-query";
import getAuthTokenClaim from "./getAuthTokenClaim";

const checkAdminAuth = async () => {
  if (!isServer) return null;

  const authTokenClaim = await getAuthTokenClaim();
  if (!authTokenClaim) return false;

  try {
    const userId = authTokenClaim.userId.replace("did:privy:", "");
    const adminIds = JSON.parse(process.env.ADMIN_DIDS! || "[]") || [];
    return adminIds.includes(userId);
  } catch (error) {
    console.log(`Token verification failed with error ${error}.`);
    return false;
  }
};

export default checkAdminAuth;
