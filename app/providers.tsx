"use client";

import OrbisProvider from "@/shared/components/OrbisProvider";
import { combineComponents } from "@/shared/lib/combineContext";
import { PrivyProvider } from "@privy-io/react-auth";
import { PropsWithChildren } from "react";

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

const providers = [
  OrbisProvider,
  ({ children }: PropsWithChildren) => {
    if (!PRIVY_APP_ID) return <>{children}</>;
    return <PrivyProvider appId={PRIVY_APP_ID}>{children}</PrivyProvider>;
  },
];
export const AppContextProvider = combineComponents(...providers);
