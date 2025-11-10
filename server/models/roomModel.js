const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			minlength: 3,
			maxlength: 50,
		},
		description: {
			type: String,
			minlength: 3,
			maxlength: 350,
		},
		category: {
			type: String,
			required: true,
			enum: [
				"Support",
				"Professional",
				"Creative",
				"Relationships",
				"Technology",
				"Discussion",
			],
		},
		resetInterval: {
			type: Number,
			required: true,
			enum: [24, 72, 168, 720],
			default: 24,
		},
		maxParticipants: {
			type: Number,
			default: 100,
			min: 2,
			max: 1000,
		},
		participantCount: {
			type: Number,
			default: 0,
			min: 0,
		},
		activeParticipants: [
			{
				userId: {
					type: Schema.Types.ObjectId,
					ref: "User",
				},
				anonymousId: {
					type: String,
				},
				joinedAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
		nextResetAt: {
			type: Date,
		},
		expiresAt: {
			type: Date,
		},
		roomType: {
			type: String,
			enum: ["official", "user-created"],
			required: true,
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: false,
		},
	},
	{
		timestamps: true,
	}
);

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;

