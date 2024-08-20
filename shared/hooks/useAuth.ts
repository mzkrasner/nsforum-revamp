import { usePrivy, useWallets } from "@privy-io/react-auth";
import { OrbisEVMAuth } from "@useorbis/db-sdk/auth";
import { useCallback, useEffect } from "react";
import useOrbis from "./useOrbis";

// TODO: Add login and logout loading states

const useAuth = () => {
  const privy = usePrivy();
  const { wallets } = useWallets();
  const connectedWallet = wallets.find((wallet) => !wallet.imported);
  const { db, authInfo, setAuthInfo } = useOrbis();

  const connectOrbis = useCallback(async () => {
    try {
      if (!privy.ready)
        return console.warn("Cannot connect to orbis when wallet is not ready");
      if (!privy.authenticated)
        return console.warn(
          "Cannot connect to orbis when wallet is not authenticated",
        );
      if (!connectedWallet)
        throw new Error("No privy wallet is connected to your account");

      let authInfo;
      const connected = await db?.isUserConnected(connectedWallet.address);
      if (connected) {
        // TODO Confirm if this gets called unneccessarily
        authInfo = await db?.getConnectedUser();
      } else {
        const provider = await connectedWallet.getEthereumProvider();
        if (!provider) throw new Error("Unable to fetch provider");
        const auth = new OrbisEVMAuth(provider);
        authInfo = await db?.connectUser({ auth });
      }
      if (!authInfo)
        throw new Error(
          "Could not fetch authentication information from orbis",
        );
      setAuthInfo(authInfo);
      return authInfo;
    } catch (error) {
      console.error(error);
    }
  }, [wallets, privy.ready, privy.authenticated, connectedWallet]);

  useEffect(() => {
    if (privy.authenticated && privy.ready && connectedWallet) {
      connectOrbis();
    }
  }, [connectOrbis, privy.ready, privy.authenticated, connectedWallet]);

  const logout = async () => {
    privy.logout();
    await db?.disconnectUser();
  };

  return {
    login: privy.login,
    isLoggedIn: !!(privy.authenticated && authInfo),
    logout,
    connectOrbis,
  };
};

export default useAuth;
