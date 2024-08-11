"use client";

import { combineComponents } from "@/shared/lib/combineContext";
import OrbisProvider from "./orbis/provider";
import AppPrivyProvider from "./privy/provider";
// import ReactQueryProvider from "./ReactQueryProvider";
// import AppWagmiProvider from "./wagmi/provider";

const providers = [
  AppPrivyProvider,
  // ReactQueryProvider,
  // AppWagmiProvider,
  OrbisProvider,
];
export const AppContextProvider = combineComponents(...providers);
