const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");
const logger = require("../utils/logger");

// Simple HTML sanitization function
const sanitizeInput = (input) => {
	if (typeof input !== "string") return input;
	return input
		.trim()
		.replace(/[<>]/g, "") // Remove < and > to prevent HTML tags
		.substring(0, 5000); // Limit length
};

// In-memory store for user sockets
const userSockets = new Map();

const setupChatHandlers = (io) => {
	io.on("connection", (socket) => {
		const userId = socket.user._id.toString();
		logger.info(`Chat socket connected for user ${userId}: ${socket.id}`);

		// Store user's socket
		if (!userSockets.has(userId)) {
			userSockets.set(userId, []);
		}
		userSockets.get(userId).push(socket.id);

		// Join a room for the user to receive private messages
		socket.join(userId);

		socket.on("sendDirectMessage", async (data) => {
			try {
				const { recipientId, content } = data;
				const senderId = socket.user._id;

				// Validate input
				if (!recipientId || !content) {
					return socket.emit("error", {
						message: "Recipient and message content are required.",
					});
				}

				// Sanitize and validate content
				const sanitizedContent = sanitizeInput(content);
				if (!sanitizedContent || sanitizedContent.length === 0) {
					return socket.emit("error", {
						message: "Message content cannot be empty.",
					});
				}

				if (sanitizedContent.length > 5000) {
					return socket.emit("error", {
						message: "Message is too long. Maximum 5000 characters.",
					});
				}

				// Prevent sending messages to yourself
				if (senderId.toString() === recipientId.toString()) {
					return socket.emit("error", {
						message: "Cannot send message to yourself.",
					});
				}

				// Find or create conversation
				let conversation = await Conversation.findOneAndUpdate(
					{
						participants: { $all: [senderId, recipientId], $size: 2 },
					},
					{ $setOnInsert: { participants: [senderId, recipientId] } },
					{ new: true, upsert: true }
				);

				// Create new message
				const message = await Message.create({
					conversationId: conversation._id,
					sender: senderId,
					content: sanitizedContent,
					readBy: [senderId],
				});

				// Update conversation's last message
				conversation.lastMessage = message._id;
				await conversation.save();

				const populatedMessage = await Message.findById(message._id).populate(
					"sender",
					"username profilePicture"
				);

				// Emit to sender and recipient
				const participantIds = [senderId.toString(), recipientId.toString()];
				participantIds.forEach((id) => {
					const userSocketIds = userSockets.get(id);
					if (userSocketIds) {
						userSocketIds.forEach((socketId) => {
							io.to(socketId).emit("newDirectMessage", {
								message: populatedMessage,
								conversationId: conversation._id,
							});
						});
					}
				});

				logger.info(
					`Message sent from ${senderId} to ${recipientId} in conversation ${conversation._id}`
				);
			} catch (error) {
				logger.error(`Error sending message: ${error.message}`);
				socket.emit("error", { message: "Failed to send message." });
			}
		});

		socket.on("markAsRead", async ({ conversationId }) => {
			try {
				const userId = socket.user._id;
				await Message.updateMany(
					{ conversationId, sender: { $ne: userId }, readBy: { $ne: userId } },
					{ $addToSet: { readBy: userId } }
				);
				// Optionally, emit an event back to confirm
				socket.emit("markedAsRead", { conversationId });
			} catch (error) {
				logger.error(`Error marking messages as read: ${error.message}`);
			}
		});

		socket.on("disconnect", () => {
			logger.info(`Chat socket disconnected for user ${userId}: ${socket.id}`);
			// Remove the disconnected socket
			if (userSockets.has(userId)) {
				const userSocketIds = userSockets
					.get(userId)
					.filter((id) => id !== socket.id);
				if (userSocketIds.length > 0) {
					userSockets.set(userId, userSocketIds);
				} else {
					userSockets.delete(userId);
				}
			}
		});
	});
};

module.exports = setupChatHandlers;
