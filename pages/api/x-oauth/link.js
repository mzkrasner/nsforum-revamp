import TwitterApi from "twitter-api-v2";
import { connectDb } from "../../../controllers/db";
import XOauthv1 from "../../../controllers/db/models/XOauthv1";
import Users from "../../../controllers/db/models/User";

const handler = async (req, res) => {
	if (req.method === "POST") {
		await connectDb();
		const { did, pathname = "/" } = req.body || {};
		if (!did) throw new Error("No did in request body");

		try {
			const client = new TwitterApi({
				appKey: process.env.X_API_KEY,
				appSecret: process.env.X_API_SECRET,
			});

			const { url, oauth_token, oauth_token_secret } =
				await client.generateAuthLink(
					`${process.env.NEXT_PUBLIC_BASE_URL}/oauth/x`,
					{
						linkMode: "authorize",
					}
				);

			await Users.updateOne({ did }, {}, { upsert: true });

			const authSecretExists = await XOauthv1.findOne({ did });
			if (authSecretExists) {
				await XOauthv1.deleteOne({ did });
			}

			await XOauthv1.create({
				did,
				oauth_token,
				oauth_token_secret,
				pathname,
			});

			res.status(200).json({ url });
		} catch (err) {
			console.log(err);
			res.status(500).send("Server Error");
		}
	}
};

export default handler;
