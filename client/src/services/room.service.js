import api from "./api";

const ROOMS_URL = "/rooms";

const roomService = {
	getAllRooms: async () => {
		try {
			const response = await api.get(ROOMS_URL);
			return response.data;
		} catch (error) {
			console.error("Get all rooms error:", error);
			const errorMessage =
				error.response?.data?.message || "Failed to fetch rooms.";
			throw new Error(errorMessage);
		}
	},
	getRoomById: async (id) => {
		try {
			const response = await api.get(`${ROOMS_URL}/${id}`);
			return response.data;
		} catch (error) {
			console.error(`Get room by ID error for ${id}:`, error);
			const errorMessage =
				error.response?.data?.message || "Failed to fetch room.";
			throw new Error(errorMessage);
		}
	},
	getRoomMessages: async (roomId, page = 1, limit = 50) => {
		try {
			const response = await api.get(`${ROOMS_URL}/${roomId}/messages`, {
				params: { page, limit },
			});
			return response.data;
		} catch (error) {
			console.error(`Get room messages error for room ${roomId}:`, error);
			const errorMessage =
				error.response?.data?.message || "Failed to fetch room messages.";
			throw new Error(errorMessage);
		}
	},
};

export default roomService;
