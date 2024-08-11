import { usePrivy, useWallets } from "@privy-io/react-auth";
import { OrbisEVMAuth } from "@useorbis/db-sdk/auth";
import { useEffect } from "react";
import useOrbis from "./useOrbis";

// TODO: Add login and logout loading states

const useAuth = () => {
  const privy = usePrivy();
  const { wallets } = useWallets();
  const orbis = useOrbis();

  useEffect(() => {
    const privyWallet = wallets.find((wallet) => !wallet.imported);
    if (!privyWallet || !privy.ready) return;

    const connectOrbis = async () => {
      try {
        const connected = await orbis?.isUserConnected(privyWallet.address);
        if (connected) return;
        const provider = await privyWallet.getEthereumProvider();
        if (!provider) throw new Error("Unable to fetch provider");
        const auth = new OrbisEVMAuth(provider);
        const authResult = await orbis?.connectUser({ auth });
        if (!authResult)
          throw new Error("Didn't recieve authentication result from orbis");
      } catch (error) {
        console.error(error);
      }
    };
    connectOrbis();
  }, [wallets, privy.ready]);

  const logout = async () => {
    privy.logout();
    await orbis?.disconnectUser();
  };

  return {
    login: privy.login,
    logout,
  };
};

export default useAuth;
