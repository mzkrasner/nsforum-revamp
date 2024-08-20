"use client";

import { combineComponents } from "@/shared/lib/combineContext";
import OrbisProvider from "./orbis/provider";
import AppPrivyProvider from "./privy/provider";
import ReactQueryProvider from "./ReactQueryProvider";

const providers = [
  AppPrivyProvider,
  ReactQueryProvider,
  OrbisProvider
];
export const AppContextProvider = combineComponents(...providers);
