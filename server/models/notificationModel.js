const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
	{
		recipient: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		sender: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		type: {
			type: String,
			enum: ["follow", "comment", "reply"],
			required: true,
		},
		post: {
			type: Schema.Types.ObjectId,
			ref: "Post",
			required: function () {
				return this.type === "comment" || this.type === "reply";
			},
		},
		read: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, read: 1 });
const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
