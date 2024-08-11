import { WagmiProvider } from "@privy-io/wagmi";
import { PropsWithChildren } from "react";
import config from "./config";

const AppWagmiProvider = ({ children }: PropsWithChildren) => {
  return <WagmiProvider config={config}>{children}</WagmiProvider>;
};

export default AppWagmiProvider;
