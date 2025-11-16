const Room = require("../models/roomModel");
const RoomMessage = require("../models/roomMessageModel");

const generateAnonymousId = () => {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let result = "user_";
	for (let i = 0; i < 4; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
};
const handleUserLeaveRoom = async (socket, roomId) => {
	try {
		socket.leave(roomId);
		const room = await Room.findById(roomId);
		if (!room) {
			return;
		}
		room.activeParticipants = room.activeParticipants.filter(
			(p) => p.userId.toString() !== socket.userId.toString()
		);
		room.participantCount = room.activeParticipants.length;
		await room.save();
		socket.to(roomId).emit("userLeft", {
			anonymousId: socket.anonymousId,
			participantCount: room.participantCount,
		});
		console.log(`User ${socket.userId} has left the room ${roomId}`);
		socket.userId = null;
		socket.roomId = null;
		socket.anonymousId = null;
	} catch (error) {
		socket.emit("error", { message: "Failed to leave room" });
	}
};

const setupRoomHandlers = (io) => {
	io.on("connection", (socket) => {
		console.log("New client connected:", socket.id);
		socket.on("joinRoom", async ({ roomId, userId }) => {
			try {
				const room = await Room.findById(roomId);
				if (!room) {
					socket.emit("error", { message: "Room not found" });
					return;
				}

				// Check if user is already in the room
				const existingParticipant = room.activeParticipants.find(
					(p) => p.userId.toString() === userId.toString()
				);

				let anonymousId;
				if (existingParticipant) {
					// User is already active in the room
					anonymousId = existingParticipant.anonymousId;
				} else {
					// Check participant history for existing anonymous ID
					const historicalParticipant = room.participantHistory.find(
						(p) => p.userId.toString() === userId.toString()
					);

					if (historicalParticipant) {
						// Reuse existing anonymous ID from history
						anonymousId = historicalParticipant.anonymousId;
					} else {
						// Generate new ID and add to history
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
				}

				socket.join(roomId);

				socket.userId = userId;
				socket.roomId = roomId;
				socket.anonymousId = anonymousId;

				socket.emit("joinedRoom", {
					roomId,
					anonymousId,
					message: "Successfully joined room",
				});
				// Notify all users in room about new participant
				io.to(roomId).emit("userJoined", {
					anonymousId,
					participantCount: room.participantCount,
				});
				console.log(`User ${userId} joined room ${roomId} as ${anonymousId}`);
			} catch (error) {
				console.error("Error joining room:", error);
				socket.emit("error", { message: "Failed to join room" });
			}
		});
		socket.on("sendMessage", async ({ roomId, content }) => {
			try {
				if (!socket.userId || !socket.anonymousId) {
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
					userId: socket.userId,
					anonymousId: socket.anonymousId,
				});
				io.to(roomId).emit("newMessage", {
					_id: message._id,
					content: message.content,
					anonymousId: message.anonymousId,
					timestamp: message.createdAt,
					isOwn: false,
				});
				console.log(`Message sent in room ${roomId} by ${socket.anonymousId}`);
			} catch (error) {
				socket.emit("error", { message: "Failed to send message" });
			}
		});

		socket.on("leaveRoom", async (roomId) => {
			await handleUserLeaveRoom(socket, roomId);
		});

		socket.on("disconnect", async () => {
			try {
				if (socket.roomId) {
					await handleUserLeaveRoom(socket, socket.roomId);
				}
				console.log("Client disconnected:", socket.id);
			} catch (error) {
				console.error("Error during disconnect:", error);
			}
		});
	});
};

module.exports = setupRoomHandlers;
