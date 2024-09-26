import { ConnectedWallet, usePrivy, useWallets } from "@privy-io/react-auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { OrbisEVMAuth } from "@useorbis/db-sdk/auth";
import { isAddress } from "viem";
import { revalidateTagsFromClient } from "../actions/utils";
import { orbisdb } from "../orbis";
import useOrbis from "./useOrbis";

const useAuth = () => {
  const queryClient = useQueryClient();

  const { ready, authenticated, logout, login, user } = usePrivy();
  const { wallets } = useWallets();
  const privyWallet = wallets.find(
    (wallet) => wallet.walletClientType === "privy",
  ); // Use the privy wallet to connect to authenticate orbis
  const { authInfo, setAuthInfo } = useOrbis();
  const did = authInfo?.user.did;

  const connectOrbis = async ({
    ready,
    authenticated,
    privyWallet,
  }: {
    ready: boolean;
    authenticated: boolean;
    privyWallet: ConnectedWallet;
  }) => {
    if (!(ready && authenticated && privyWallet)) return null;
    try {
      let authInfo;
      const connected = await orbisdb.isUserConnected(privyWallet.address);
      if (connected) {
        authInfo = await orbisdb.getConnectedUser();
      } else {
        const provider = await privyWallet.getEthereumProvider();
        if (!provider) throw new Error("Unable to fetch provider");
        const auth = new OrbisEVMAuth(provider);
        authInfo = await orbisdb.connectUser({ auth });
      }
      if (!authInfo)
        throw new Error(
          "Could not fetch authentication information from orbis",
        );
      setAuthInfo(authInfo);
      return authInfo;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const connectOrbisQuery = useQuery({
    queryKey: ["connect-orbis", { ready, authenticated, privyWallet }],
    queryFn: async () => {
      if (!privyWallet) return null;
      return await connectOrbis({ ready, authenticated, privyWallet });
    },
    enabled: ready && authenticated && !!privyWallet,
  });

  const linkedWallets = user?.linkedAccounts.filter(
    (acct: Record<string, any> & { address?: string }) =>
      acct.address && isAddress(acct.address),
  );

  const linkedPhone = user?.linkedAccounts.find((acc) => acc.type === "phone");
  const linkedTwitterAcct = user?.linkedAccounts.find(
    (acc) => acc.type === "twitter_oauth",
  );

  const isVerified = !!(linkedPhone || linkedTwitterAcct);

  return {
    linkedPhone,
    linkedTwitterAcct,
    isVerified,
    linkedWallets,
    login: async () => {
      if (!authenticated) {
        login();
      } else if (!authInfo) {
        await connectOrbisQuery.refetch();
      }
    },
    isLoggedIn: !!(authenticated && authInfo),
    logout: async () => {
      logout();
      queryClient.resetQueries();
      await orbisdb.disconnectUser();
      await revalidateTagsFromClient([
        "auth-token-claims",
        "current-privy-user",
      ]);
    },
  };
};

export default useAuth;
