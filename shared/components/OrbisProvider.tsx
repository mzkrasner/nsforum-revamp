import { OrbisDB } from "@useorbis/db-sdk";
import { createContext, ReactNode, useRef } from "react";

const OrbisContext = createContext<OrbisDB | null>(null);

type Props = { children: ReactNode };
const OrbisProvider = ({ children }: Props) => {
  const orbis = useRef(
    new OrbisDB({
      ceramic: {
        gateway: process.env.NEXT_PUBLIC_CERAMIC_NODE_URL as string,
      },
      nodes: [
        {
          gateway: process.env.NEXT_PUBLIC_ORBIS_NODE_URL as string,
        },
      ],
    }),
  ).current;
  return (
    <OrbisContext.Provider value={orbis}>{children}</OrbisContext.Provider>
  );
};
export default OrbisProvider;
