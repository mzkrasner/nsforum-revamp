import TwitterApi from "twitter-api-v2";
import XOauthv1 from "../../../controllers/db/models/XOauthv1";
import Users from "../../../controllers/db/models/User";

const handler = async (req, res) => {
	if (req.method === "POST") {
		// try {
		// Extract tokens from query string
		const { oauth_token, oauth_verifier, username, did } = req.body;

		// Get the saved oauth_token_secret from session
		const authSecret = await XOauthv1.findOne({
			oauth_token,
		});
		const { oauth_token_secret, pathname } = authSecret || {};
		if (!oauth_token || !oauth_verifier || !oauth_token_secret) {
			res.status(200).json({
				success: false,
				error: "You denied the app or your session expired!",
			});
			return;
		}

		// Obtain the persistent tokens
		// Create a client from temporary tokens
		const client = new TwitterApi({
			appKey: process.env.X_API_KEY,
			appSecret: process.env.X_API_SECRET,
			accessToken: oauth_token,
			accessSecret: oauth_token_secret,
		});

		const loginRes = await client.login(oauth_verifier);
		const { client: loggedClient, accessToken, accessSecret } = loginRes || {};
		if (!loggedClient) {
			res.status(200).json({
				success: false,
				error: "Invalid verifier or access tokens!",
			});
			return;
		}

		const currentUser = await loggedClient.currentUser();
		const { screen_name } = currentUser || {};

		if (!screen_name) {
			res.status(200).json({
				success: false,
				error: "Could not get X username!",
			});
			return;
		}

		if (username?.toLowerCase() !== screen_name?.toLowerCase()) {
			res.status(200).json({
				success: false,
				error: `The username ${username} does not match your X username of ${screen_name}. Note that usernames are NOT case sensitive`,
			});
			return;
		}

		await Users.updateOne({ did }, { username });
		await XOauthv1.deleteOne({ oauth_token });
		res.status(200).json({ success: true, pathname });
		// } catch (err) {
		// 	// console.log(err);
		// 	const keys = Object.keys(err.data || {});
		// 	res.status(200).json({
		// 		success: false,
		// 		error: keys.length ? keys[0] : "Server Error",
		// 	});
		// }
	}
};

export default handler;
