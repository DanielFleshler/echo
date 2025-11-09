const Notification = require("../models/notificationModel");
const { sendError, sendSuccess } = require("../utils/http/responseUtils");

exports.getNotifications = async (req, res) => {
	try {
		const currentUser = req.user;

		const pageNumber = parseInt(req.query.page) || 1;
		const limit = 30;
		const skip = (pageNumber - 1) * limit;

		const notifications = await Notification.find({
			recipient: currentUser._id,
		})
			.sort({ createdAt: -1 })
			.limit(30)
			.skip(skip)
			.populate("sender", "username fullName profilePicture");

		const totalCount = await Notification.countDocuments({
			recipient: currentUser._id,
		});

		return sendSuccess(res, 200, "Notifications retrieved successfully", {
			data: {
				notifications: notifications,
				pagination: {
					currentPage: pageNumber,
					totalCount: totalCount,
					totalPages: Math.ceil(totalCount / limit),
					hasMore: pageNumber * limit < totalCount,
				},
			},
		});
	} catch (error) {
		return sendError(res, 500, "Error fetching notifications");
	}
};

exports.markAsRead = async (req, res) => {
	try {
		const notificationId = req.params.id;
		const notification = await Notification.findById(notificationId);

		if (!notification) {
			return sendError(res, 404, "Notification not found");
		}

		if (notification.recipient.toString() !== req.user._id.toString()) {
			return sendError(
				res,
				403,
				"You don't have permission to mark this notification as read"
			);
		}

		notification.read = true;
		await notification.save();

		return sendSuccess(res, 200, "Notification marked as read successfully", {
			data: { notification },
		});
	} catch (error) {
		return sendError(res, 500, "Error marking notification as read");
	}
};

exports.markAllAsRead = async (req, res) => {
	try {
		const result = await Notification.updateMany(
			{
				recipient: req.user._id,
				read: false,
			},
			{ read: true }
		);

		return sendSuccess(
			res,
			200,
			"All notifications marked as read successfully",
			{
				data: {
					modifiedCount: result.modifiedCount,
				},
			}
		);
	} catch (error) {
		return sendError(res, 500, "Error marking all notifications as read");
	}
};
