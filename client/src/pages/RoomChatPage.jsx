import { Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChatInput from "../components/chat/ChatInput";
import ChatMessage from "../components/chat/ChatMessage";
import RoomHeader from "../components/chat/RoomHeader";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import roomService from "../services/room.service";
import {
	connectSocket,
	disconnectSocket,
	joinRoom,
	leaveRoom,
	offEvent,
	onEvent,
	sendMessage,
} from "../services/roomSocket.service";

export default function RoomChatPage() {
	const { roomId } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();
	const toast = useToast();
	const [room, setRoom] = useState(null);
	const [messages, setMessages] = useState([]);
	const messagesEndRef = useRef(null);
	const [currentUserAnonymousId, setCurrentUserAnonymousId] = useState(null);

	useEffect(() => {
		const userId = user.userId;
		if (!userId) {
			navigate("/login");
			return;
		}
		const socket = connectSocket();
		socket.connect();

		joinRoom(roomId, userId);
		onEvent("joinedRoom", (data) => {
			const anonymousId = data.anonymousId;
			setCurrentUserAnonymousId(anonymousId);
		});

		onEvent("newMessage", (message) => {
			setMessages((prev) => [...prev, message]);
		});

		onEvent("error", (error) => {
			toast.showError(error.message || "An error occurred");
		});

		roomService
			.getRoomById(roomId)
			.then((res) => {
				setRoom(res.data.room);
			})
			.catch((err) => {
				toast.showError(err.message);
			});

		const fetchMessages = async () => {
			try {
				const res = await roomService.getRoomMessages(roomId, 1, 50);
				setMessages(res.data.messages);
			} catch (error) {
				toast.showError(error.message);
			}
		};
		fetchMessages();

		return () => {
			leaveRoom(roomId);
			offEvent("joinedRoom");
			offEvent("newMessage");
			offEvent("error");
		};
	}, [roomId]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleSendMessage = async (content) => {
		try {
			sendMessage(roomId, content);
		} catch (error) {
			toast.showError("Failed to send message");
		}
	};

	if (!room) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-gray-950">
			{/* Header */}
			<RoomHeader room={room} />

			{/* Privacy Notice */}
			<div className="bg-blue-600/10 border-b border-blue-600/20">
				<div className="container max-w-6xl mx-auto px-4 py-3">
					<div className="flex items-center gap-2 text-sm text-blue-400">
						<Shield className="h-4 w-4 flex-shrink-0" />
						<span>
							Your identity is anonymous. Messages will be deleted when this
							room resets.
						</span>
					</div>
				</div>
			</div>

			{/* Messages Area */}
			<div className="flex-1 overflow-hidden">
				<div className="h-full overflow-y-auto">
					<div className="container max-w-4xl mx-auto px-4 py-6">
						<div className="space-y-4">
							{messages.map((message) => (
								<ChatMessage key={message._id} message={message} />
							))}
							<div ref={messagesEndRef} />
						</div>
					</div>
				</div>
			</div>

			{/* Message Input */}
			<ChatInput onSendMessage={handleSendMessage} />
		</div>
	);
}
