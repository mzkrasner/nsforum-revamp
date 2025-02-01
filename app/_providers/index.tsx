"use client";
// Client side providers

import { combineComponents } from "@/shared/lib/combineContext";
import OrbisProvider from "./orbis/provider";
import AppSilkProvider from "./silk/provider";
import ReactQueryProvider from "./react-query/provider";

const providers = [AppSilkProvider, ReactQueryProvider, OrbisProvider];
export const AppContextProvider = combineComponents(...providers);
