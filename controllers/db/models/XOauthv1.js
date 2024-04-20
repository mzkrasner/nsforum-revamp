import mongoose from "mongoose";

const Schema = mongoose.Schema;

const XOauthv1Schema = new Schema(
	{
		did: { type: String, required: true, unique: true },
		pathname: { type: String, required: true },
		oauth_token: { type: String, required: true },
		oauth_token_secret: { type: String, required: true },
	},
	{ timestamps: true }
);

const XOauthv1 =
	mongoose.models.XOauthv1 || mongoose.model("XOauthv1", XOauthv1Schema);
export default XOauthv1;
