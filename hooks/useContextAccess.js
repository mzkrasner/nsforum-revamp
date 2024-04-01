/** Will load the details of the context and check if user has access to it  */
import { useState } from 'react';
import { useOrbis, checkContextAccess } from '@orbisclub/components'
import { useQuery } from '@tanstack/react-query';

const useContextAccess = (props = {}) => {
  const { context = global.orbis_context } = props
  const { user, orbis } = useOrbis();
  const [accessRules, setAccessRules] = useState([]);

  const updateList = async (context) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    const gotAttestations = await fetch("/api/getList", requestOptions).then(
      (response) => response.json()
    );
    if (gotAttestations.data.accountAttestationIndex == null) return;
    const arr = gotAttestations.data.accountAttestationIndex.edges.map(
      (a) =>
        new Object({
          attester: `did:pkh:eip155:1:${a.node.attester}`,
          recipient: `did:pkh:eip155:1:${a.node.recipient}`,
        })
    );
    const uniqueArr = [...new Set(arr)];
    const multipleRecipients = uniqueArr.filter(
      //isolate instances where the recipient value appears more than once
      (a) => uniqueArr.filter((b) => b.recipient === a.recipient).length > 1
    );

    const final = [...new Set(multipleRecipients.map((a) => a.recipient))];
    final.push({ category: context })
    const newOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(final),
    };
    await fetch("/api/update", newOptions).then((response) =>
      response.json()
    );
  }

  const checkUserAccess = async () => {
    if (!user) return false;
    let { data, error } = await orbis.getContext(context);
    let hasAccess = false;
    if (data?.content.accessRules.length > 0) {
      const currAccessRules = data?.content.accessRules.filter(
        (item) => item.type === "did"
      );
      if (currAccessRules.length > 0) {
        await updateList(context);
      }
    }
    if (data && data.content) {
      /** Save context access rules in state */
      setAccessRules(
        data?.content.accessRules ? data?.content.accessRules : []
      );

      /** Now check if user has access */
      if (!data?.content.accessRules || data?.content.accessRules.length == 0) {
        hasAccess = true;
      } else {
        checkContextAccess(user, data?.content?.accessRules, () =>
          hasAccess = true
        );
      }
    }
    return hasAccess
  }

  const { data: hasAccess, isLoading: loading, isFetching: fetching } = useQuery({
    queryKey: ['user-access', { userDid: user?.did }], // recheck on logout or login
    queryFn: checkUserAccess,
    staleTime: Infinity
  })

  return { hasAccess, loading, fetching }

}

export default useContextAccess;