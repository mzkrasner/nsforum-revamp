import { orbisdb } from "@/shared/orbis";
import { OrbisConnectResult, OrbisDB } from "@useorbis/db-sdk";
import { createContext, ReactNode, useRef, useState } from "react";

export const OrbisContext = createContext<{
  db: OrbisDB;
  authInfo: OrbisConnectResult | null;
  setAuthInfo: (authInfo: OrbisConnectResult) => void;
}>({
  db: orbisdb,
  authInfo: null,
  setAuthInfo: () => null,
});

type Props = { children: ReactNode };
const OrbisProvider = ({ children }: Props) => {
  const [authInfo, setAuthInfo] = useState<OrbisConnectResult | null>(null);
  const _orbisdb = useRef(orbisdb).current;

  return (
    <OrbisContext.Provider
      value={{
        db: _orbisdb,
        authInfo,
        setAuthInfo,
      }}
    >
      {children}
    </OrbisContext.Provider>
  );
};
export default OrbisProvider;
