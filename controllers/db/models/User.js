import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		did: { type: String, required: true, unique: true },
		username: String, // Only locked usernames are stored here Orbis handles other usernames by default
	},
	{
		timestamps: true,
	}
);

const Users = mongoose.models.Users || mongoose.model("Users", UserSchema);
export default Users;
