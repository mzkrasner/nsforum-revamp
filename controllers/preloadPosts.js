import axios from "axios";

const PAGE_SIZE = 10;

export default async function preloadPosts(context, page = 0) {
	const { data } = await axios.get(
		`https://s5n3r9eg8h.execute-api.us-east-1.amazonaws.com/posts`,
		{ params: { context, page, pageSize: PAGE_SIZE } }
	);
	return data?.docs || [];
}
