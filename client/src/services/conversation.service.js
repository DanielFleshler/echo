import api from "./api";

const CONVERSATIONS_URL = "/conversations";

const conversationService = {
	getConversations: async () => {
		try {
			const response = await api.get(CONVERSATIONS_URL);
			return response.data;
		} catch (error) {
			const errorMessage =
				error.response?.data?.message || "Failed to fetch conversations.";
			throw new Error(errorMessage);
		}
	},

	createOrGetConversation: async (recipientId) => {
		try {
			const response = await api.post(CONVERSATIONS_URL, { recipientId });
			return response.data;
		} catch (error) {
			const errorMessage =
				error.response?.data?.message || "Failed to process conversation.";
			throw new Error(errorMessage);
		}
	},

	getMessages: async (conversationId) => {
		try {
			const response = await api.get(
				`${CONVERSATIONS_URL}/${conversationId}/messages`
			);
			return response.data;
		} catch (error) {
			const errorMessage =
				error.response?.data?.message || "Failed to fetch messages.";
			throw new Error(errorMessage);
		}
	},
};

export default conversationService;
