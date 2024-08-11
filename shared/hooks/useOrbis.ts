import { useContext } from "react";
import { OrbisContext } from "../../app/providers/orbis/provider";

const useOrbis = () => {
  const orbis = useContext(OrbisContext);
  return orbis;
};

export default useOrbis;
