import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { OrbisEVMAuth } from "@useorbis/db-sdk/auth";
import { isAddress } from "viem";
import useOrbis from "./useOrbis";

const useAuth = () => {
  const queryClient = useQueryClient();

  const { ready, authenticated, logout, login, user } = usePrivy();
  const { wallets } = useWallets();
  const privyWallet = wallets.find(
    (wallet) => wallet.walletClientType === "privy",
  ); // Use the privy wallet to connect to authenticate orbis
  const { db, authInfo, setAuthInfo } = useOrbis();

  const connectOrbis = async () => {
    if (!(ready && authenticated && privyWallet)) return;
    try {
      let authInfo;
      const connected = await db?.isUserConnected(privyWallet.address);
      if (connected) {
        authInfo = await db?.getConnectedUser();
      } else {
        const provider = await privyWallet.getEthereumProvider();
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
  };

  useQuery({
    queryKey: ["connect-orbis", { privyWallet }],
    queryFn: connectOrbis,
    enabled: ready && authenticated && !!privyWallet,
  });

  const linkedWallets = user?.linkedAccounts.filter(
    (acct: Record<string, any> & { address?: string }) =>
      acct.address && isAddress(acct.address),
  );

  const linkedPhone = user?.linkedAccounts.find((acc) => acc.type === "phone");
  const linkedXAcct = user?.linkedAccounts.find(
    (acc) => acc.type === "twitter_oauth",
  );

  const isVerified = !!(linkedPhone || linkedXAcct);

  return {
    linkedPhone,
    linkedXAcct,
    isVerified,
    linkedWallets,
    login,
    isLoggedIn: !!(authenticated && authInfo),
    logout: async () => {
      logout();
      queryClient.resetQueries({ queryKey: ["profile"] });
      queryClient.resetQueries({ queryKey: ["admin"] });
      await db?.disconnectUser();
    },
  };
};

export default useAuth;
