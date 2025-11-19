import { io } from "socket.io-client";
import { API_CONFIG } from "../constants/config";

const SOCKET_URL = API_CONFIG.SOCKET_URL;

let socket = null;
export const connectSocket = () => {
	if (!socket) {
		// Get JWT token from cookies for authentication
		const token = document.cookie
			.split('; ')
			.find(row => row.startsWith('jwt='))
			?.split('=')[1];

		socket = io(SOCKET_URL, {
			autoConnect: false,
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionAttempts: 5,
			withCredentials: true,
			auth: {
				token: token
			}
		});
	}
	return socket;
};

export const joinRoom = (roomId) => {
	if (!socket) return;
	socket.emit("joinRoom", { roomId });
};

export const sendMessage = (roomId, content) => {
	if (!socket) return;
	socket.emit("sendMessage", { roomId, content });
};

export const leaveRoom = (roomId) => {
	if (!socket) return;
	socket.emit("leaveRoom", roomId);
};

export const onEvent = (eventName, callback) => {
	if (!socket) return;
	socket.on(eventName, callback);
};

export const offEvent = (eventName, callback) => {
	if (!socket) return;
	socket.off(eventName, callback);
};

export const disconnectSocket = () => {
	if (socket) {
		socket.disconnect();
	}
	socket = null;
};
