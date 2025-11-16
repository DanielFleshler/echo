const Room = require("../models/roomModel");
const RoomMessage = require("../models/roomMessageModel");
const logger = require("../utils/logger");

const generateAnonymousId = () => {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let result = "user_";
	for (let i = 0; i < 4; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
};

const setupRoomHandlers = (io) => {
	io.on("connection", (socket) => {
		logger.info(`New client connected: ${socket.id}`);

		socket.on("joinRoom", async ({ roomId }) => {
			try {
				const room = await Room.findById(roomId);
				if (!room) {
					socket.emit("error", { message: "Room not found" });
					return;
				}

				const userId = socket.user._id;

				// Check if user already in room (idempotent - safe to call multiple times)
				let participant = room.activeParticipants.find(
					(p) => p.userId.toString() === userId.toString()
				);

				let anonymousId;
				let isNewJoin = false;

				if (participant) {
					// User already in room - just return current state
					anonymousId = participant.anonymousId;
					logger.info(
						`User ${userId} already in room ${roomId} as ${anonymousId}`
					);
				} else {
					// New join - get or create anonymous ID
					isNewJoin = true;

					// Check history for existing anonymous ID
					const historical = room.participantHistory.find(
						(p) => p.userId.toString() === userId.toString()
					);

					if (historical) {
						anonymousId = historical.anonymousId;
					} else {
						anonymousId = generateAnonymousId();
						room.participantHistory.push({
							userId,
							anonymousId,
							firstJoinedAt: new Date(),
						});
					}

					// Add to active participants
					room.activeParticipants.push({
						userId,
						anonymousId,
						joinedAt: new Date(),
					});

					room.participantCount = room.activeParticipants.length;
					await room.save();

					logger.info(`User ${userId} joined room ${roomId} as ${anonymousId}`);
				}

				// Join Socket.IO room
				socket.join(roomId);

				// Store state on socket
				socket.roomId = roomId;
				socket.anonymousId = anonymousId;

				// Always send current state to the joining user
				socket.emit("joinedRoom", {
					roomId,
					anonymousId,
					participantCount: room.participantCount,
					message: "Successfully joined room",
				});

				// Only notify others if this is a NEW join (not a duplicate/reconnect)
				if (isNewJoin) {
					socket.to(roomId).emit("userJoined", {
						anonymousId,
						participantCount: room.participantCount,
					});
				}
			} catch (error) {
				logger.error(`Error joining room: ${error.message}`);
				socket.emit("error", { message: "Failed to join room" });
			}
		});

		socket.on("sendMessage", async ({ roomId, content }) => {
			try {
				if (!socket.user || !socket.anonymousId) {
					socket.emit("error", { message: "You must join a room first" });
					return;
				}
				if (!content || !content.trim()) {
					socket.emit("error", { message: "Message cannot be empty" });
					return;
				}

				const room = await Room.findById(roomId);
				if (room) {
					room.messageCount = (room.messageCount || 0) + 1;
					await room.save();
				}

				const message = await RoomMessage.create({
					content: content.trim(),
					roomId,
					userId: socket.user._id,
					anonymousId: socket.anonymousId,
				});

				const messageData = {
					_id: message._id,
					content: message.content,
					anonymousId: message.anonymousId,
					timestamp: message.createdAt,
				};

				// Send to sender with isOwn: true
				socket.emit("newMessage", { ...messageData, isOwn: true });

				// Send to others with isOwn: false
				socket.to(roomId).emit("newMessage", { ...messageData, isOwn: false });

				logger.info(`Message sent in room ${roomId} by ${socket.anonymousId}`);
			} catch (error) {
				logger.error(`Error sending message: ${error.message}`);
				socket.emit("error", { message: "Failed to send message" });
			}
		});

		socket.on("leaveRoom", async (roomId) => {
			try {
				if (!socket.user || !socket.roomId) {
					// User not in any room, nothing to do
					return;
				}

				const room = await Room.findById(roomId);
				if (!room) {
					return;
				}

				// Remove from active participants
				const initialLength = room.activeParticipants.length;
				room.activeParticipants = room.activeParticipants.filter(
					(p) => p.userId.toString() !== socket.user._id.toString()
				);

				// Only update if we actually removed someone
				if (room.activeParticipants.length < initialLength) {
					room.participantCount = room.activeParticipants.length;
					await room.save();

					// Notify others (not the user who left)
					socket.to(roomId).emit("userLeft", {
						anonymousId: socket.anonymousId,
						participantCount: room.participantCount,
					});

					logger.info(`User ${socket.user._id} left room ${roomId}`);
				}

				// Leave Socket.IO room
				socket.leave(roomId);

				// Clear socket state
				socket.roomId = null;
				socket.anonymousId = null;
			} catch (error) {
				logger.error(`Error leaving room: ${error.message}`);
				socket.emit("error", { message: "Failed to leave room" });
			}
		});

		socket.on("disconnect", async () => {
			try {
				if (socket.roomId && socket.user) {
					// User disconnected while in a room - clean up
					const room = await Room.findById(socket.roomId);
					if (room) {
						const initialLength = room.activeParticipants.length;
						room.activeParticipants = room.activeParticipants.filter(
							(p) => p.userId.toString() !== socket.user._id.toString()
						);

						if (room.activeParticipants.length < initialLength) {
							room.participantCount = room.activeParticipants.length;
							await room.save();

							// Notify others (user already disconnected)
							socket.to(socket.roomId).emit("userLeft", {
								anonymousId: socket.anonymousId,
								participantCount: room.participantCount,
							});

							logger.info(
								`User ${socket.user._id} disconnected from room ${socket.roomId}`
							);
						}
					}
				}
				logger.info(`Client disconnected: ${socket.id}`);
			} catch (error) {
				logger.error(`Error during disconnect: ${error.message}`);
			}
		});
	});
};

module.exports = setupRoomHandlers;
