require("dotenv").config();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const User = require("./models/userModel");
const Post = require("./models/postModel");
const Follower = require("./models/followerModel");
const Notification = require("./models/notificationModel");
const Room = require("./models/roomModel");
const RoomMessage = require("./models/roomMessageModel");
const Conversation = require("./models/conversationModel");
const Message = require("./models/messageModel");

dotenv.config({ path: "./.env" });

const connectDB = async () => {
	try {
		const DB = process.env.DATABASE.replace(
			"<PASSWORD>",
			process.env.DATABASE_PASSWORD
		);
		await mongoose.connect(DB);
		console.log("MongoDB connected successfully!");
	} catch (err) {
		console.error("Failed to connect to MongoDB", err);
		process.exit(1);
	}
};

const clearDatabase = async () => {
	try {
		console.log("Clearing all collections...");
		await User.deleteMany({});
		await Post.deleteMany({});
		await Follower.deleteMany({});
		await Notification.deleteMany({});
		await Room.deleteMany({});
		await RoomMessage.deleteMany({});
		await Conversation.deleteMany({});
		await Message.deleteMany({});
		console.log("Database cleared! All collections are now empty.");
	} catch (err) {
		console.error("Error clearing database:", err);
		process.exit(1);
	}
};

const createAdminUser = async () => {
	try {
		const adminUser = await User.create({
			username: "admin",
			email: "admin@example.com",
			password: "admin123",
			passwordConfirm: "admin123",
			fullName: "Admin User",
			isVerified: true,
			bio: "System administrator",
		});

		console.log("Admin user created successfully!");
		console.log(`Admin username: ${adminUser.username}`);
		console.log(`Admin email: ${adminUser.email}`);
		console.log(`Admin password: ${adminUser.passwordConfirm}`);
	} catch (err) {
		console.error("Error creating admin user:", err);
		process.exit(1);
	}
};

const cleanDatabase = async () => {
	try {
		await connectDB();
		await clearDatabase();
		await createAdminUser();
	} catch (err) {
		console.error("Error cleaning database:", err);
		process.exit(1);
	} finally {
		await mongoose.connection.close();
		console.log("MongoDB connection closed.");
		process.exit(0);
	}
};

cleanDatabase();

module.exports = cleanDatabase;
