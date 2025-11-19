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
	const currentUserAnonymousIdRef = useRef(null);
	const [messagePage, setMessagePage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loadingMore, setLoadingMore] = useState(false);
	const messagesContainerRef = useRef(null);

	useEffect(() => {
		currentUserAnonymousIdRef.current = currentUserAnonymousId;
	}, [currentUserAnonymousId]);

	useEffect(() => {
		const userId = user._id;

		if (!userId) {
			navigate("/login");

			return;
		}

		const socket = connectSocket();

		socket.connect();

		joinRoom(roomId);

		onEvent("joinedRoom", (data) => {
			const anonymousId = data.anonymousId;

			setCurrentUserAnonymousId(anonymousId);
		});

		onEvent("newMessage", (message) => {
			setMessages((prev) => [...prev, message]);
		});

		onEvent("userJoined", (data) => {
			// Update participant count in real-time

			setRoom((prev) =>
				prev
					? {
							...prev,

							participantCount: data.participantCount,
					  }
					: prev
			);

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

			setRoom((prev) =>
				prev
					? {
							...prev,

							participantCount: data.participantCount,
					  }
					: prev
			);
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
				toast.showError(err.message || "Room not found");
				// Redirect to rooms page if room doesn't exist
				setTimeout(() => {
					navigate("/rooms");
				}, 2000);
			});

		const fetchMessages = async () => {
			try {
				const res = await roomService.getRoomMessages(roomId, 1, 50);

				setMessages(res.data.messages);
				setTotalPages(res.data.pagination.totalPages);
				setMessagePage(1);
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

	const fetchMoreMessages = async () => {
		if (loadingMore || messagePage >= totalPages) return;

		setLoadingMore(true);
		try {
			const nextPage = messagePage + 1;
			const res = await roomService.getRoomMessages(roomId, nextPage, 50);

			const messageContainer = messagesContainerRef.current;
			const oldScrollHeight = messageContainer.scrollHeight;

			setMessages((prev) => [...res.data.messages, ...prev]);
			setTotalPages(res.data.pagination.totalPages);
			setMessagePage(nextPage);

			// Restore scroll position
			requestAnimationFrame(() => {
				messageContainer.scrollTop =
					messageContainer.scrollHeight - oldScrollHeight;
			});
		} catch (error) {
			toast.showError(error.message);
		} finally {
			setLoadingMore(false);
		}
	};

	const handleScroll = (e) => {
		if (e.target.scrollTop === 0) {
			fetchMoreMessages();
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
				<div className="container max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
					<div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-blue-400">
						<Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" aria-hidden="true" />
						<span>
							Your identity is anonymous. Messages will be deleted when this
							room resets.
						</span>
					</div>
				</div>
			</div>

			{/* Messages Area */}
			<div className="flex-1 overflow-hidden">
				<div
					ref={messagesContainerRef}
					onScroll={handleScroll}
					className="h-full overflow-y-auto"
				>
					<div className="container max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-6">
						{loadingMore && (
							<div className="flex justify-center my-2 sm:my-4">
								<div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-purple-400" role="status" aria-label="Loading more messages"></div>
							</div>
						)}
						{messages.length === 0 ? (
							<div className="flex flex-col items-center justify-center h-full text-center px-4">
								<div className="mb-3 sm:mb-4 p-4 sm:p-6 rounded-full bg-gray-800/50">
									<Shield className="h-10 w-10 sm:h-12 sm:w-12 text-purple-400" aria-hidden="true" />
								</div>
								<h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
									Start the conversation
								</h3>
								<p className="text-sm sm:text-base text-gray-400 max-w-md">
									Be the first to share your thoughts in this anonymous space.
									Your identity is protected and messages will reset
									periodically.
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
			<ChatInput
				onSendMessage={handleSendMessage}
				multiline={true}
				showHint={true}
				placeholder="Share your thoughts anonymously..."
			/>
		</div>
	);
}
