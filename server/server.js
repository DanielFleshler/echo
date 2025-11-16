// Handle uncaught exceptions FIRST before any other code
process.on("uncaughtException", (err) => {
	console.error("UNCAUGHT EXCEPTION! Shutting down...");
	console.error(`${err.name}: ${err.message}`);
	console.error(err.stack);
	process.exit(1);
});

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");

dotenv.config({ path: "./.env" });

const { app } = require("./app");
const logger = require("./utils/logger");
const User = require("./models/userModel");
const setupRoomHandlers = require("./sockets/roomSocketHandlers");
const setupChatHandlers = require("./sockets/chatSocketHandlers");

const DB = process.env.DATABASE.replace(
	"<PASSWORD>",
	process.env.DATABASE_PASSWORD
);

// Log connection attempt (without password)
logger.info(`Attempting to connect to MongoDB...`);
logger.info(`DATABASE env exists: ${!!process.env.DATABASE}`);
logger.info(`DATABASE_PASSWORD env exists: ${!!process.env.DATABASE_PASSWORD}`);

mongoose
	.connect(DB, {
		serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
		socketTimeoutMS: 45000,
	})
	.then(() => {
		logger.info("DB connection successful!");
	})
	.catch((err) => {
		logger.error("Error connecting to database:", err);
		logger.error(
			"MongoDB connection failed. Check your DATABASE and DATABASE_PASSWORD environment variables."
		);
	});

const uploadDir = path.join(__dirname, "tmp", "uploads");
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

const port = process.env.PORT || 8000;
const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: [
			process.env.FRONTEND_URL || "http://localhost:5173",
			"https://echo-lxld.onrender.com",
			"https://echo-server-p42j.onrender.com",
		],
		methods: ["GET", "POST"],
		credentials: true,
	},
});

io.use(async (socket, next) => {
	try {
		logger.info("Socket connection attempt from:", socket.handshake.address);
		logger.info("Socket handshake headers:", socket.handshake.headers);

		let token;
		if (socket.handshake.headers.cookie) {
			const cookies = cookie.parse(socket.handshake.headers.cookie);
			logger.info("Parsed cookies:", Object.keys(cookies));
			token = cookies.jwt;
		}

		if (!token) {
			logger.error("No JWT token found in cookies");
			return next(new Error("Authentication error: No token provided."));
		}

		logger.info("JWT token found, verifying...");

		const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
		const freshUser = await User.findById(decoded.id);

		if (!freshUser) {
			return next(new Error("Authentication error: User no longer exists."));
		}

		if (freshUser.changedPasswordAfter(decoded.iat)) {
			return next(new Error("Authentication error: Password changed."));
		}

		socket.user = freshUser;
		logger.info(
			`Socket authenticated successfully for user: ${freshUser.username} (${freshUser._id})`
		);
		next();
	} catch (err) {
		logger.error(`Socket authentication error: ${err.message}`);
		logger.error("Stack:", err.stack);
		return next(new Error("Authentication error: Invalid token."));
	}
});

setupRoomHandlers(io);
setupChatHandlers(io);

server.listen(port, () => {
	logger.info(`App running on port ${port} in ${process.env.NODE_ENV} mode`);
});

process.on("unhandledRejection", (err) => {
	logger.error("UNHANDLED REJECTION! Shutting down...");
	logger.error(`${err.name}: ${err.message}`);
	logger.error(err.stack);
	server.close(() => {
		process.exit(1);
	});
});
