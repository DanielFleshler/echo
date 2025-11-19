import { io } from "socket.io-client";
import { API_CONFIG, SOCKET_CONFIG } from "../constants/config";

const SOCKET_URL = API_CONFIG.SOCKET_URL;

let chatSocket = null;
let connectionCallbacks = [];

export const connectChatSocket = () => {
	if (chatSocket && chatSocket.connected) {
		return chatSocket;
	}

	if (chatSocket) {
		chatSocket.connect();
		return chatSocket;
	}

	// Get JWT token from cookies for authentication
	const token = document.cookie
		.split('; ')
		.find(row => row.startsWith('jwt='))
		?.split('=')[1];

	chatSocket = io(SOCKET_URL, {
		autoConnect: SOCKET_CONFIG.AUTO_CONNECT,
		reconnection: SOCKET_CONFIG.RECONNECTION,
		reconnectionDelay: SOCKET_CONFIG.RECONNECTION_DELAY,
		reconnectionAttempts: SOCKET_CONFIG.RECONNECTION_ATTEMPTS,
		withCredentials: SOCKET_CONFIG.WITH_CREDENTIALS,
		transports: SOCKET_CONFIG.TRANSPORTS,
		auth: {
			token: token
		}
	});

	chatSocket.on("connect", () => {
		connectionCallbacks.forEach(callback => callback(true));
		connectionCallbacks = [];
	});

	chatSocket.on("disconnect", (reason) => {
		if (process.env.NODE_ENV === "development") {
			console.warn("Chat socket disconnected:", reason);
		}
	});

	chatSocket.on("connect_error", (error) => {
		console.error("Chat socket connection error:", error.message);
		connectionCallbacks.forEach(callback => callback(false));
		connectionCallbacks = [];
	});

	chatSocket.io.on("reconnect_failed", () => {
		console.error("Chat socket reconnection failed");
	});

	return chatSocket;
};

export const waitForConnection = () => {
	return new Promise((resolve) => {
		if (chatSocket && chatSocket.connected) {
			resolve(true);
		} else {
			connectionCallbacks.push(resolve);
			setTimeout(() => {
				const index = connectionCallbacks.indexOf(resolve);
				if (index > -1) {
					connectionCallbacks.splice(index, 1);
					resolve(false);
				}
			}, SOCKET_CONFIG.CONNECTION_TIMEOUT);
		}
	});
};

export const getChatSocket = () => chatSocket;

export const isSocketConnected = () => {
	return chatSocket && chatSocket.connected;
};

export const sendChatMessage = (recipientId, content) => {
	if (!chatSocket || !chatSocket.connected) {
		console.error("Chat socket not available");
		return;
	}
	chatSocket.emit("sendDirectMessage", { recipientId, content });
};

export const markAsRead = (conversationId) => {
	if (!chatSocket) return;
	chatSocket.emit("markAsRead", { conversationId });
};

export const onNewMessage = (callback) => {
	if (!chatSocket) return;
	chatSocket.on("newDirectMessage", callback);
};

export const offNewMessage = (callback) => {
	if (!chatSocket) return;
	chatSocket.off("newDirectMessage", callback);
};

export const onSocketEvent = (eventName, callback) => {
	if (!chatSocket) return;
	chatSocket.on(eventName, callback);
};

export const offSocketEvent = (eventName, callback) => {
	if (!chatSocket) return;
	chatSocket.off(eventName, callback);
};

export const disconnectChatSocket = () => {
	if (chatSocket) {
		chatSocket.disconnect();
		chatSocket = null;
	}
};
