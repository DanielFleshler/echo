const Room = require("../models/roomModel");
const RoomMessage = require("../models/roomMessageModel");
const { sendError, sendSuccess } = require("../utils/http/responseUtils");
const logger = require("../utils/logger");

exports.getAllRooms = async (req, res) => {
	try {
		const filter = {};
		if (req.query.category) {
			filter.category = req.query.category;
		}

		const rooms = await Room.find(filter)
			.sort({ createdAt: -1 })
			.populate("createdBy", "username profilePicture");

		return sendSuccess(res, 200, "Rooms retrieved successfully", {
			data: { rooms, count: rooms.length },
		});
	} catch (error) {
		logger.error(`Error fetching rooms: ${error.message}`);
		return sendError(res, 500, "Failed to fetch rooms");
	}
};
exports.getRoomById = async (req, res) => {
	try {
		const roomId = req.params.id;
		const room = await Room.findById(roomId).populate("createdBy");
		if (!room) {
			return sendError(res, 404, "Room not found");
		}
		return sendSuccess(res, 200, "Room retrieved successfully", {
			data: { room },
		});
	} catch (error) {
		logger.error(`Error fetching room by id: ${error.message}`);
		return sendError(res, 500, "Failed to fetch room");
	}
};

exports.getRoomMessages = async (req, res) => {
	try {
		const roomId = req.params.id;
		const room = await Room.findById(roomId);
		if (!room) {
			return sendError(res, 404, "Room not found");
		}

		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 50;
		const skip = (page - 1) * limit;

		const messages = await RoomMessage.find({ roomId: roomId })
			.sort({ createdAt: 1 })
			.skip(skip)
			.limit(limit);

		const requestingUserId = req.user._id.toString();

		// Add isOwn flag to each message
		const messagesWithOwn = messages.map((msg) => ({
			_id: msg._id,
			content: msg.content,
			anonymousId: msg.anonymousId,
			timestamp: msg.createdAt,
			isOwn: msg.userId.toString() === requestingUserId,
		}));

		const totalMessages = await RoomMessage.countDocuments({ roomId: roomId });
		return sendSuccess(res, 200, "Messages retrieved successfully", {
			data: {
				messages: messagesWithOwn,
				pagination: {
					currentPage: page,
					totalPages: Math.ceil(totalMessages / limit),
					totalMessages,
					messagesPerPage: limit,
				},
			},
		});
	} catch (error) {
		logger.error(`Error fetching messages: ${error.message}`);
		return sendError(res, 500, "Failed to fetch messages");
	}
};

exports.createRoom = async (req, res) => {
	try {
		const { name, description, category, resetInterval, maxParticipants } =
			req.body;
		const nextResetAt = new Date(Date.now() + resetInterval * 60 * 60 * 1000);
		const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
		const createdBy = req.user._id;

		const room = await Room.create({
			name,
			description,
			category,
			roomType: "user-created",
			createdBy,
			resetInterval,
			nextResetAt,
			expiresAt,
			maxParticipants,
		});

		return sendSuccess(res, 200, "Room has been created successfully", {
			data: {
				room,
			},
		});
	} catch (error) {
		logger.error(`Error creating room: ${error.message}`);
		return sendError(res, 500, "Failed to create room");
	}
};
exports.updateRoom = async (req, res) => {
	try {
		const roomId = req.params.id;
		const room = await Room.findById(roomId);
		if (!room) {
			return sendError(res, 404, "Room not found");
		}
		if (room.createdBy.toString() !== req.user._id.toString()) {
			return sendError(
				res,
				403,
				"You do not have permission to update this room"
			);
		}
		const allowedUpdates = [
			"name",
			"description",
			"category",
			"resetInterval",
			"maxParticipants",
		];
		allowedUpdates.forEach((field) => {
			if (req.body[field] !== undefined) {
				room[field] = req.body[field];
			}
		});
		await room.save();
		return sendSuccess(res, 200, "Room updated successfully", {
			data: { room },
		});
	} catch (error) {
		logger.error(`Error updating room: ${error.message}`);
		return sendError(res, 500, "Failed to update room");
	}
};

exports.deleteRoom = async (req, res) => {
	try {
		const roomId = req.params.id;
		const room = await Room.findById(roomId);
		if (!room) {
			return sendError(res, 404, "Room not found");
		}
		if (room.createdBy.toString() !== req.user._id.toString()) {
			return sendError(
				res,
				403,
				"You do not have permission to delete this room"
			);
		}
		await Room.findByIdAndDelete(roomId);
		await RoomMessage.deleteMany({ roomId: roomId });
		return sendSuccess(res, 200, "Room deleted successfully");
	} catch (error) {
		logger.error(`Error deleting room: ${error.message}`);
		return sendError(res, 500, "Failed to delete room");
	}
};
