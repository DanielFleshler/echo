const User = require("../models/userModel");
const { sendError, sendSuccess } = require("../utils/http/responseUtils");

exports.searchUsers = async (req, res) => {
	try {
		const searchQuery = req.query.q;

		if (!searchQuery || searchQuery.trim().length < 2) {
			return sendError(res, 400, "Search query must be at least 2 characters.");
		}

		const trimmedQuery = searchQuery.trim();

		const users = await User.find({
			$or: [
				{ username: { $regex: trimmedQuery, $options: "i" } },
				{ fullName: { $regex: trimmedQuery, $options: "i" } },
			],
		})
			.select("_id username fullName profilePicture")
			.limit(7);

		return sendSuccess(res, 200, "Search Query retrieved successfully", {
			data: { users },
		});
	} catch (error) {
		return sendError(res, 500, "An error occurred while searching for users.");
	}
};
