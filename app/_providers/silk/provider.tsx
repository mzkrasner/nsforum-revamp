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
      projectId: env.NEXT_PUBLIC_PROJECT_ID,
    }),
  ],
});

const AppSilkProvider = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    try {
      const testReferralCode = "aaaaaaaaaaaaaaaaaaaaaaaa";
      const provider = initSilk({
        // referralCode: testReferralCode
        // config: {
        //   appName: 'Uniswap',
        //   darkMode: true
        //   // appLogo: `${window.location.origin}${Uniswap}`
        // }
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
