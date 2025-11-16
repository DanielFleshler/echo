import { io } from "socket.io-client";
import { API_CONFIG } from "../constants/config";

const SOCKET_URL = API_CONFIG.SOCKET_URL;

let socket = null;
export const connectSocket = () => {
	if (!socket) {
		socket = io(SOCKET_URL, {
			autoConnect: false,
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionAttempts: 5,
			withCredentials: true,
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
