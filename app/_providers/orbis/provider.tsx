import { OrbisConnectResult, OrbisDB } from "@useorbis/db-sdk";
import { createContext, ReactNode, useRef, useState } from "react";
import config from "./config";

export const OrbisContext = createContext<{
  db: OrbisDB;
  authInfo: OrbisConnectResult | null;
  setAuthInfo: (authInfo: OrbisConnectResult) => void;
}>({
  db: new OrbisDB(config),
  authInfo: null,
  setAuthInfo: () => null,
});

type Props = { children: ReactNode };
const OrbisProvider = ({ children }: Props) => {
  const [authInfo, setAuthInfo] = useState<OrbisConnectResult | null>(null);
  const orbisdb = useRef(new OrbisDB(config)).current;

  return (
    <OrbisContext.Provider
      value={{
        db: orbisdb,
        authInfo,
        setAuthInfo,
      }}
    >
      {children}
    </OrbisContext.Provider>
  );
};
export default OrbisProvider;
