import { useOrbis } from '@orbisclub/components';
import { useQuery } from '@tanstack/react-query'

const useContexts = () => {
  const { orbis } = useOrbis();

  /** Load all of the categories (sub-contexts) available in this forum */
  const getContexts = async () => {
    let { data, error } = await orbis.api
      .from("orbis_contexts")
      .select()
      .eq("context", global.orbis_context)
      .order("created_at", { ascending: false });
    if (data && data.length > 0) {
      return data
    }
    return []
  }

  const { data, isLoading: loading, isFetching: fetching } = useQuery({
    queryKey: ['contexts'],
    queryFn: getContexts
  })

  return { contexts: data, loading, fetching }
}

export default useContexts