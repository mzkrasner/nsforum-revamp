import { useQuery } from "@tanstack/react-query";
import { checkSBT } from "../lib/utils";
import useOrbis from "./useOrbis";

const useVerification = () => {
  const { authInfo } = useOrbis();
  const did = authInfo?.user.did;
  const address = authInfo?.user.metadata.address;

  const queryKey = ["verification", { did, address }];

  const verificationQuery = useQuery({
    queryKey,
    queryFn: async () => await checkSBT(address),
    enabled: !!address,
    refetchOnWindowFocus: true,
  });

  return { verificationQuery, verified: true || verificationQuery.data };
};

export default useVerification;
