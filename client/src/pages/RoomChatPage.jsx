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
	const currentUserAnonymousIdRef = useRef(null); // Use ref to avoid closure issues

	// Update ref and isOwn flag when currentUserAnonymousId changes
	useEffect(() => {
		currentUserAnonymousIdRef.current = currentUserAnonymousId;
		if (currentUserAnonymousId) {
			setMessages((prev) =>
				prev.map((msg) => ({
					...msg,
					isOwn: msg.anonymousId === currentUserAnonymousId,
				}))
			);
		}
	}, [currentUserAnonymousId]);

	useEffect(() => {
		const userId = user._id;
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
			setMessages((prev) => [
				...prev,
				{
					...message,
					isOwn: message.anonymousId === currentUserAnonymousIdRef.current,
				},
			]);
		});

		onEvent("userJoined", (data) => {
			// Update participant count in real-time
			setRoom((prev) => prev ? ({
				...prev,
				participantCount: data.participantCount,
			}) : prev);

			// Only show join message for OTHER users, not yourself
			if (data.anonymousId !== currentUserAnonymousIdRef.current) {
				setMessages((prev) => [
					...prev,
					{
						_id: `system-${Date.now()}-${Math.random()}`,
						type: "system",
						content: `${data.anonymousId} joined the room`,
						timestamp: new Date(),
					},
				]);
			}
		});

		onEvent("userLeft", (data) => {
			// Add system message for user leave
			setMessages((prev) => [
				...prev,
				{
					_id: `system-${Date.now()}-${Math.random()}`,
					type: "system",
					content: `${data.anonymousId} left the room`,
					timestamp: new Date(),
				},
			]);
			// Update participant count in real-time
			setRoom((prev) => prev ? ({
				...prev,
				participantCount: data.participantCount,
			}) : prev);
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
				// Mark messages as isOwn after we have the anonymousId
				const messagesWithOwn = res.data.messages.map((msg) => ({
					...msg,
					isOwn: false, // Will be updated once we get currentUserAnonymousId
				}));
				setMessages(messagesWithOwn);
			} catch (error) {
				toast.showError(error.message);
			}
		};
		fetchMessages();

		return () => {
			leaveRoom(roomId);
			offEvent("joinedRoom");
			offEvent("newMessage");
			offEvent("userJoined");
			offEvent("userLeft");
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
						{messages.length === 0 ? (
							<div className="flex flex-col items-center justify-center h-full text-center">
								<div className="mb-4 p-6 rounded-full bg-gray-800/50">
									<Shield className="h-12 w-12 text-purple-400" />
								</div>
								<h3 className="text-xl font-semibold text-white mb-2">
									Start the conversation
								</h3>
								<p className="text-gray-400 max-w-md">
									Be the first to share your thoughts in this anonymous space.
									Your identity is protected and messages will reset periodically.
								</p>
							</div>
						) : (
							<div className="space-y-0">
								{messages.map((message, index) => (
									<ChatMessage
										key={message._id}
										message={message}
										previousMessage={index > 0 ? messages[index - 1] : null}
									/>
								))}
								<div ref={messagesEndRef} />
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Message Input */}
			<ChatInput onSendMessage={handleSendMessage} />
		</div>
	);
}
