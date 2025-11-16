const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const { sendError, sendSuccess } = require("../utils/http/responseUtils");
const logger = require("../utils/logger");

exports.getConversations = async (req, res) => {
	try {
		const userId = req.user._id;

		const conversations = await Conversation.find({ participants: userId })
			.populate({
				path: "participants",
				select: "username profilePicture online",
			})
			.populate({
				path: "lastMessage",
				populate: {
					path: "sender",
					select: "username profilePicture",
				},
			})
			.sort({ updatedAt: -1 });

		const formattedConversations = conversations.map((convo) => {
			const otherParticipant = convo.participants.find(
				(p) => p._id.toString() !== userId.toString()
			);
			return {
				_id: convo._id,
				participant: otherParticipant,
				lastMessage: convo.lastMessage,
				updatedAt: convo.updatedAt,
			};
		});

		return sendSuccess(res, 200, "Conversations retrieved successfully", {
			data: { conversations: formattedConversations },
		});
	} catch (error) {
		logger.error(`Error fetching conversations: ${error.message}`);
		return sendError(res, 500, "Failed to fetch conversations");
	}
};

exports.getMessages = async (req, res) => {
	try {
		const { conversationId } = req.params;
		const userId = req.user._id;

		const conversation = await Conversation.findOne({
			_id: conversationId,
			participants: userId,
		});

		if (!conversation) {
			return sendError(res, 404, "Conversation not found");
		}

		const messages = await Message.find({ conversationId })
			.populate("sender", "username profilePicture")
			.sort({ createdAt: 1 });

		// Mark messages as read
		await Message.updateMany(
			{ conversationId, sender: { $ne: userId }, readBy: { $ne: userId } },
			{ $addToSet: { readBy: userId } }
		);

		return sendSuccess(res, 200, "Messages retrieved successfully", {
			data: { messages },
		});
	} catch (error) {
		logger.error(`Error fetching messages: ${error.message}`);
		return sendError(res, 500, "Failed to fetch messages");
	}
};

exports.createOrGetConversation = async (req, res) => {
	try {
		const { recipientId } = req.body;
		const senderId = req.user._id;

		if (!recipientId) {
			return sendError(res, 400, "Recipient ID is required");
		}

		if (recipientId === senderId.toString()) {
			return sendError(res, 400, "You cannot start a conversation with yourself");
		}

		const recipient = await User.findById(recipientId);
		if (!recipient) {
			return sendError(res, 404, "Recipient not found");
		}

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, recipientId], $size: 2 },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, recipientId],
			});
		}

		const populatedConversation = await Conversation.findById(conversation._id)
			.populate({
				path: "participants",
				select: "username profilePicture online",
			})
			.populate({
				path: "lastMessage",
				populate: {
					path: "sender",
					select: "username profilePicture",
				},
			});

		const otherParticipant = populatedConversation.participants.find(
			(p) => p._id.toString() !== senderId.toString()
		);

		const formattedConversation = {
			_id: populatedConversation._id,
			participant: otherParticipant,
			lastMessage: populatedConversation.lastMessage,
			updatedAt: populatedConversation.updatedAt,
			isNew: !conversation.lastMessage, // Flag if it's a brand new conversation
		};

		return sendSuccess(res, 200, "Conversation retrieved successfully", {
			data: { conversation: formattedConversation },
		});
	} catch (error) {
		logger.error(`Error creating or getting conversation: ${error.message}`);
		return sendError(res, 500, "Failed to process conversation");
	}
};
