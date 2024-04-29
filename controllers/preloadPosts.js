import axios from "axios";

const DEFAULT_PAGE_SIZE = 10;

export default async function preloadPosts(payload = {}) {
	const { page = 0, pageSize = DEFAULT_PAGE_SIZE } = payload;
	const { data } = await axios.get(
		`https://s5n3r9eg8h.execute-api.us-east-1.amazonaws.com/posts`,
		{ params: { ...payload, page, pageSize } }
	);
	return data?.docs || [];
}
