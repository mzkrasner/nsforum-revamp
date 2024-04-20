import { connectDb } from "../../../controllers/db";
import Users from "../../../controllers/db/models/User";

const handler = async (req, res) => {
	if (req.method === "POST") {
		await connectDb();
		const { did } = req.body;
		const user = await Users.findOne({ did });
		const { username = null } = user || {};
		res.status(200).json({ username });
	}
};

export default handler;
