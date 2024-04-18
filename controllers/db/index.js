import mongoose from "mongoose";

// Replace the uri string with your connection string.
const uri = process.env.MONGO_URI;

export const connectDb = async () => {
	if (mongoose.connection.readyState === 1) return;
	console.log("connecting to mongodb...");
	if (!uri) throw new Error("Add MONGO_URI to .env");
	return mongoose.connect(uri).then(() => console.log("MongoDb connected!"));
};
