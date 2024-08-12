import { ConnectedWallet, usePrivy, useWallets } from "@privy-io/react-auth";
import { OrbisEVMAuth } from "@useorbis/db-sdk/auth";
import { useCallback, useEffect } from "react";
import useOrbis from "./useOrbis";

// TODO: Add login and logout loading states

const useAuth = () => {
  const privy = usePrivy();
  const { wallets } = useWallets();
  const orbis = useOrbis();

  const connectOrbis = useCallback(async (connectedWallet: ConnectedWallet) => {
    try {
      const connected = await orbis?.isUserConnected(connectedWallet.address);
      if (connected) return;
      const provider = await connectedWallet.getEthereumProvider();
      if (!provider) throw new Error("Unable to fetch provider");
      const auth = new OrbisEVMAuth(provider);
      const authResult = await orbis?.connectUser({ auth });
      if (!authResult)
        throw new Error("Didn't recieve authentication result from orbis");
      return authResult;
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    const privyWallet = wallets.find((wallet) => !wallet.imported);
    if (!privyWallet || !privy.ready || !privy.authenticated) return;
    connectOrbis(privyWallet);
  }, [wallets, privy.ready, privy.authenticated, connectOrbis]);

  const logout = async () => {
    privy.logout();
    await orbis?.disconnectUser();
  };

  return {
    login: privy.login,
    logout,
    connectOrbis,
  };
};

export default useAuth;
