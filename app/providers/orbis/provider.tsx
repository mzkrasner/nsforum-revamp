import { OrbisDB } from "@useorbis/db-sdk";
import { createContext, ReactNode, useRef } from "react";
import config from "./config";

export const OrbisContext = createContext<OrbisDB | null>(null);

type Props = { children: ReactNode };
const OrbisProvider = ({ children }: Props) => {
  const orbis = useRef(new OrbisDB(config)).current;
  return (
    <OrbisContext.Provider value={orbis}>{children}</OrbisContext.Provider>
  );
};
export default OrbisProvider;
