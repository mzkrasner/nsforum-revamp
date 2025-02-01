import { useQuery, useQueryClient } from "@tanstack/react-query";
import { OrbisEVMAuth } from "@useorbis/db-sdk/auth";
import { useState } from "react";
import { useAccount, useAccountEffect, useConnect, useDisconnect } from "wagmi"; // Removed useWalletClient since it's not needed
import { orbisdb } from "../orbis";
import useOrbis from "./useOrbis";

const useAuth = () => {
  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount(); // Get the wallet's address and connection state
  const { connect, connectors } = useConnect();
  const [connecting, setConnecting] = useState(false);
  const { authInfo, setAuthInfo } = useOrbis();
  const { disconnect } = useDisconnect();



  const connectOrbis = async () => {
    setConnecting(true);
    if (!window.ethereum || !isConnected || !address) {
      console.error("Wallet not connected or incomplete state");
      setConnecting(false);
      return null;
    }

    try {
      const connected = await orbisdb.isUserConnected(address);
      let authInfo;

      if (connected) {
        authInfo = await orbisdb.getConnectedUser();
      } else {
        const provider = window.ethereum; // Use window.ethereum directly as the provider
        const auth = new OrbisEVMAuth(provider);
        authInfo = await orbisdb.connectUser({ auth });
      }

      if (!authInfo) {
        throw new Error(
          "Could not fetch authentication information from Orbis",
        );
      }

      setAuthInfo(authInfo); // Save auth info in context or state
      setConnecting(false);
      return authInfo;
    } catch (error) {
      console.error("Orbis connection error:", error);
      return null;
    }
  };

  const login = async () => {
    console.log("Logging in with Silk Wallet...");
    // @ts-ignore
    window.silk
      .loginSelector(window.ethereum)
      // @ts-ignore
      .then((result) => {
        if (result === "silk") {
          // @ts-ignore
          window.ethereum = window.silk;
        } else if (result === "injected") {
          connect({
            connector: connectors.filter((conn) => conn.id === "injected")[0],
          });
        }
        // else if (result === "walletconnect") {
        //   connect({
        //     connector: connectors.filter(
        //       (conn) => conn.id === "walletConnect",
        //     )[0],
        //   });
        // }
      })
      // @ts-ignore
      .catch((err) => console.error(err));
  };

  const connectOrbisQuery = useQuery({
    queryKey: ["connect-orbis", { isConnected }],
    queryFn: async () => {
      if (!isConnected) return null;
      return await connectOrbis();
    },
    enabled: isConnected,
  });

  useAccountEffect({
    onConnect(data) {
      console.log("Connected!", data);
      // force a re render of the app
      queryClient.invalidateQueries();
    },
    onDisconnect() {
      setConnecting(false);
    },
  });

  return {
    address, // Current connected wallet address
    isConnected, // Whether the wallet is connected
    login: async () => {
      if (!isConnected) {
        login();
      } else if (!authInfo) {
        await connectOrbisQuery.refetch();
      }
    },
    connect: connectOrbis, // Connect to Orbis
    isLoggedIn: !!authInfo,
    isConnecting: connecting,
    logout: async () => {
      disconnect();
      queryClient.resetQueries();
      localStorage.removeItem("orbis:session");
      await orbisdb.disconnectUser();
      // @ts-ignore
      setAuthInfo(null);
      setConnecting(false);
    },
  };
};

export default useAuth;
