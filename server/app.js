const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const logger = require("./utils/logger");

const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");
const followerRouter = require("./routes/followerRoutes");
const notificationRouter = require("./routes/notificationRoutes");
const roomRouter = require("./routes/roomRoutes");
const conversationRouter = require("./routes/conversationRoutes");

dotenv.config();

const app = express();

// Security middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(
	cors({
		origin: [
			process.env.FRONTEND_URL || "http://localhost:5173",
			"https://echo-server-p42j.onrender.com",
			"https://echo-lxld.onrender.com",
		],
		credentials: true,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

// Rate limiting - general API limiter
const generalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per windowMs
	message: "Too many requests from this IP, please try again later.",
	standardHeaders: true,
	legacyHeaders: false,
});

// Stricter rate limiting for authentication endpoints
const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5, // Limit each IP to 5 requests per windowMs
	message: "Too many authentication attempts, please try again later.",
	standardHeaders: true,
	legacyHeaders: false,
});

app.use(cookieParser());
app.use(express.json({ limit: "10mb" })); // Add size limit to prevent DOS
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/", (req, res) => {
	res.status(200).json({
		status: "success",
		message: "API is working correctly",
	});
});

// Health check endpoint for uptime monitoring (no rate limiting)
app.get("/health", (req, res) => {
	res.status(200).json({
		status: "ok",
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
	});
});

// Apply general rate limiter to all /api routes (Express v5 compatible)
app.use(/^\/api\/.*/, generalLimiter);

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/followers", followerRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/rooms", roomRouter);
app.use("/api/v1/conversations", conversationRouter);

// Handle undefined routes - Express v5 syntax
app.use((req, res, next) => {
	res.status(404).json({
		status: "error",
		message: `Can't find ${req.originalUrl} on this server`,
	});
});

// Global error handling middleware
app.use((err, req, res, next) => {
	logger.error("Error:", err);

	// Handle multer file upload errors
	if (err.code === "LIMIT_FILE_SIZE") {
		return res.status(413).json({
			status: "error",
			message: "File too large. Maximum size is 200MB.",
		});
	}

	if (err.code === "LIMIT_FILE_COUNT") {
		return res.status(400).json({
			status: "error",
			message: "Too many files. Maximum is 5 files.",
		});
	}

	// Handle mongoose validation errors
	if (err.name === "ValidationError") {
		const errors = Object.values(err.errors).map((e) => e.message);
		return res.status(400).json({
			status: "error",
			message: "Validation failed",
			errors,
		});
	}

	// Handle mongoose cast errors (invalid ObjectId)
	if (err.name === "CastError") {
		return res.status(400).json({
			status: "error",
			message: `Invalid ${err.path}: ${err.value}`,
		});
	}

	// Handle duplicate key errors
	if (err.code === 11000) {
		const field = Object.keys(err.keyValue)[0];
		return res.status(400).json({
			status: "error",
			message: `${field} already exists`,
		});
	}

	// Default error
	const statusCode = err.statusCode || 500;
	const message = err.message || "Internal server error";

	res.status(statusCode).json({
		status: "error",
		message,
		...(process.env.NODE_ENV === "development" && { stack: err.stack }),
	});
});

module.exports = { app, authLimiter };
