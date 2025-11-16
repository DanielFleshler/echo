const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
	{
		participants: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		lastMessage: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message",
			default: null,
		},
	},
	{ timestamps: true }
);

// Indexes for better query performance
conversationSchema.index({ participants: 1 });
conversationSchema.index({ updatedAt: -1 });
// Compound index for finding conversations between two users
conversationSchema.index({ participants: 1, updatedAt: -1 });

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
