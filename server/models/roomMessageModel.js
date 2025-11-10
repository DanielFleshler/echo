const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomMessageSchema = new Schema(
	{
		content: {
			type: String,
			required: [true, "message content cannot be empty."],
			minlength: [1, "message length must be at least 1"],
			maxlength: 500,
		},

		roomId: {
			type: Schema.Types.ObjectId,
			ref: "Room",
			required: [true, "message must belong to a room"],
		},

		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		anonymousId: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);
roomMessageSchema.index({ roomId: 1, createdAt: 1 });
const RoomMessage = mongoose.model("RoomMessage", roomMessageSchema);
module.exports = RoomMessage;
