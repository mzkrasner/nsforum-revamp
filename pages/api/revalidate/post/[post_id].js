import { sleep } from "../../../../utils";
export default async function handler(req, res) {
	if (req.method === "POST") {
		await sleep(1500);
		const { post_id } = req.query;
		// Regenerate post page
		res.revalidate(`/post/${post_id}`);
		res.revalidate("/");
	}
	res.status(200).end();
}
