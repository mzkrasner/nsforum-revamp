import axios from "axios";

export const preloadPost = async (postId) => {
	const { data } = await axios.get(
		`https://s5n3r9eg8h.execute-api.us-east-1.amazonaws.com/posts/${postId}`
	);
	return data;
};
