const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
	{
		conversationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Conversation",
			required: true,
		},
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		content: {
			type: String,
			trim: true,
			required: true,
			maxlength: [5000, "Message cannot exceed 5000 characters"],
		},
		readBy: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{ timestamps: true }
);

// Indexes for better query performance
messageSchema.index({ conversationId: 1, createdAt: 1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ conversationId: 1, sender: 1, readBy: 1 });

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
