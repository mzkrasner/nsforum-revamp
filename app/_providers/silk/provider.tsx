import { initSilk } from "@silk-wallet/silk-wallet-sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useEffect, useState } from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { base, Chain, hardhat } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";
import { env } from "@/env";
import "../../../app/_styles/globals.css";

const defaultChains: Chain[] = [base];

if (process.env.NODE_ENV == "development") {
  defaultChains.push(hardhat);
}

const wagmiConfig = createConfig({
  chains: defaultChains as any as readonly [Chain, ...Chain[]],
  transports: {
    [base.id]: http(),
    // [sepolia.id]: http(),
    // [polygon.id]: http(),
    // [gnosis.id]: http(),
    // [optimism.id]: http(),
  },
  connectors: [
    injected(),
    walletConnect({
      projectId: "9079d1a5fcc1e24a84174328e8eb9be2",
    }),
  ],
});

const AppSilkProvider = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    try {
      const provider = initSilk({
      });
      // @ts-ignore
      window.silk = provider;
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};

export default AppSilkProvider;
