import { PrivyClientConfig } from "@privy-io/react-auth";
import { base } from "viem/chains";

const config: PrivyClientConfig = {
  // Replace this with your desired default chain
  defaultChain: base,
  // Replace this with a list of your desired supported chains
  supportedChains: [base],
  embeddedWallets: {
    createOnLogin: "all-users",
  },
};

export default config;
