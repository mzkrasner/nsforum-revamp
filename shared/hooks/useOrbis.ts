import { useContext } from "react";
import { OrbisContext } from "../../app/_providers/orbis/provider";

const useOrbis = () => {
  const orbis = useContext(OrbisContext);
  return orbis;
};

export default useOrbis;
