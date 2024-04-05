// Handles proof of personhood
import { useOrbis } from "@orbisclub/components";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { cloneDeep } from "lodash-es";

const useHolo = () => {
  const { user } = useOrbis();

  const queryClient = useQueryClient();
  const queryKey = ["proof-of-personhood", user?.did];

  const checkHolo = async (address) => {
    const resp = await fetch(
      `https://api.holonym.io/sybil-resistance/gov-id/optimism?user=${address}&action-id=123456789`
    );
    const res = await resp.json();
    const { result: isUnique } = res;
    return !!isUnique;
  };

  /** Will load the details of the context and check if user has access to it  */
  const { data: isUnique, isFetching: fetching } = useQuery({
    queryKey,
    queryFn: checkHolo,
    staleTime: Infinity,
    refetchOnWindowFocus: true,
  });

  const refreshProofOfPersonhood = () => {
    queryClient.invalidateQueries({
      queryKey: cloneDeep(queryKey),
    });
  };

  return { isUnique, fetching, refreshProofOfPersonhood };
};

export default useHolo;
