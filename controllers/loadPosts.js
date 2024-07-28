import { Orbis } from "@orbisclub/orbis-sdk";
import getAttestationsReceived from "./getAttestationsReceived";

const DEFAULT_PAGE_SIZE = 10;

/** Load list of posts using the Orbis SDK */
export default async function loadPosts(
	context,
	include_child_contexts,
	_page
) {
	const orbis = new Orbis({
		useLit: true,
		node: "https://node2.orbis.club",
		PINATA_GATEWAY: 'violet-deliberate-marten-707.mypinata.cloud',
	});

	let { data, error } = await orbis.api
		.rpc("get_ranked_posts", { q_context: context })
		.range(_page * DEFAULT_PAGE_SIZE, (_page + 1) * DEFAULT_PAGE_SIZE * 2 - 1);

	/*  let { data, error } = await orbis.getPosts({
    context: context,
    only_master: true,
    order_by: 'count_likes',
    include_child_contexts: include_child_contexts,
  }, _page, DEFAULT_PAGE_SIZE);*/

	/** Save data in posts state */
	if (data) {
		const applyVerified = async (items) => {
			const list = [];
			for (let i = 0; i < items.length; i++) {
				const account = items[i].creator_details.metadata.address.toLowerCase();
				const gotAttestations = await getAttestationsReceived(account);
				// change this to if user has more than 3 instead of greater than zero
				if (gotAttestations?.data?.accountAttestationIndex?.edges?.length > 0) {
					items[i].verified = true;
					items[i].attestationLength =
						gotAttestations.data.accountAttestationIndex.edges.length;
				} else {
					items[i].verified = false;
				}
				list.push(items[i]);
			}
			return list;
		};

		const newData = await applyVerified(data);
		return newData;
	}
}
