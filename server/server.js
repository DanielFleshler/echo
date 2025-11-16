const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const http = require("http");

dotenv.config({ path: "./.env" });

const app = require("./app");
const logger = require("./utils/logger");
const setupRoomHandlers = require("./sockets/roomSocketHandlers");

const DB = process.env.DATABASE.replace(
	"<PASSWORD>",
	process.env.DATABASE_PASSWORD
);

mongoose
	.connect(DB)
	.then(() => {
		logger.info("DB connection successful!");
	})
	.catch((err) => {
		logger.error("Error connecting to database:", err);
	});

const uploadDir = path.join(__dirname, "tmp", "uploads");
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}
const port = process.env.PORT || 8000;

const server = http.createServer(app);
const { Server } = require("socket.io");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const User = require("./models/userModel");

const io = new Server(server, {
	cors: {
		origin: process.env.FRONTEND_URL || "http://localhost:5173",
		methods: ["GET", "POST"],
		credentials: true,
	},
});

io.use(async (socket, next) => {
	try {
		let token;
		if (socket.handshake.headers.cookie) {
			const cookies = cookie.parse(socket.handshake.headers.cookie);
			token = cookies.jwt;
		}

		if (!token) {
			return next(new Error("Authentication error: No token provided."));
		}

		const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
		const freshUser = await User.findById(decoded.id);

		if (!freshUser) {
			return next(new Error("Authentication error: User no longer exists."));
		}

		if (freshUser.changedPasswordAfter(decoded.iat)) {
			return next(new Error("Authentication error: Password changed."));
		}

		socket.user = freshUser;
		next();
	} catch (err) {
		logger.error(`Socket authentication error: ${err.message}`);
		return next(new Error("Authentication error: Invalid token."));
	}
});

setupRoomHandlers(io);

server.listen(port, () => {
	logger.info(`App running on port ${port} in ${process.env.NODE_ENV} mode...`);
});

process.on("unhandledRejection", (err) => {
	logger.error("UNHANDLED REJECTION! 💥 Shutting down...");
	logger.error(`${err.name}: ${err.message}`);
	server.close(() => {
		process.exit(1);
	});
});

process.on("uncaughtException", (err) => {
	logger.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
	logger.error(`${err.name}: ${err.message}`);
	process.exit(1);
});
