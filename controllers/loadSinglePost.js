import { Orbis } from "@orbisclub/orbis-sdk";
import axios from "axios";

export default async function (postId) {
	let orbis = new Orbis({
		useLit: true,
	});
	let { data, error } = await orbis.getPost(postId);
	const post = data;
	// get like data from mongodb
	const res = await axios.get(
		`https://s5n3r9eg8h.execute-api.us-east-1.amazonaws.com/posts/${postId}/likes`
	);
	if (res.data?.count_likes) {
		post.count_likes = res.data.count_likes;
	}
	return post;
}
