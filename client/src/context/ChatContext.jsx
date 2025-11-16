import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";
import conversationService from "../services/conversation.service";
import {
	connectChatSocket,
	onNewMessage,
	offNewMessage,
	onSocketEvent,
	offSocketEvent,
	disconnectChatSocket,
	isSocketConnected as checkSocketConnected,
	waitForConnection,
} from "../services/chatSocket.service";
import { useAuth } from "./AuthContext";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
	const { user } = useAuth();
	const [conversations, setConversations] = useState([]);
	const [messages, setMessages] = useState({}); // { conversationId: [messages] }
	const [activeConversation, setActiveConversation] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isChatModalOpen, setIsChatModalOpen] = useState(false);
	const [isSocketConnected, setIsSocketConnected] = useState(false);

	const fetchConversations = useCallback(async () => {
		try {
			setLoading(true);
			const response = await conversationService.getConversations();
			setConversations(response.data.conversations);
			setError(null);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		if (!user) return;

		connectChatSocket();
		fetchConversations();

		// Wait for socket connection
		waitForConnection().then((connected) => {
			setIsSocketConnected(connected);
			if (!connected) {
				setError("Failed to connect to chat server");
			}
		});

		const handleConnect = () => {
			setIsSocketConnected(true);
			setError(null);
		};

		const handleDisconnect = () => {
			setIsSocketConnected(false);
		};

		const handleNewMessage = (data) => {
			const { message, conversationId } = data;

			setMessages((prev) => ({
				...prev,
				[conversationId]: [...(prev[conversationId] || []), message],
			}));

			setConversations((prev) => {
				const conversationIndex = prev.findIndex(c => c._id === conversationId);
				if (conversationIndex !== -1) {
					const updatedConversations = [...prev];
					const conversation = { ...updatedConversations[conversationIndex] };
					conversation.lastMessage = message;
					conversation.updatedAt = message.createdAt;

					updatedConversations.splice(conversationIndex, 1);
					return [conversation, ...updatedConversations];
				} else {
					fetchConversations();
					return prev;
				}
			});
		};

		const handleSocketError = (data) => {
			setError(data?.message || "Chat connection error");
		};

		onNewMessage(handleNewMessage);
		onSocketEvent("error", handleSocketError);
		onSocketEvent("connect", handleConnect);
		onSocketEvent("disconnect", handleDisconnect);

		return () => {
			offNewMessage(handleNewMessage);
			offSocketEvent("error", handleSocketError);
			offSocketEvent("connect", handleConnect);
			offSocketEvent("disconnect", handleDisconnect);
			disconnectChatSocket();
		};
	}, [user, fetchConversations]);

	const fetchMessages = useCallback(async (conversationId) => {
		try {
			const response = await conversationService.getMessages(conversationId);
			setMessages((prev) => ({
				...prev,
				[conversationId]: response.data.messages,
			}));
		} catch (err) {
			// Error already handled by service
		}
	}, []);

	const selectConversation = useCallback(
		(conversationId) => {
			setActiveConversation(conversationId);
			if (!messages[conversationId]) {
				fetchMessages(conversationId);
			}
		},
		[messages, fetchMessages]
	);

	const createOrGetConversation = useCallback(async (recipientId) => {
		try {
			const response = await conversationService.createOrGetConversation(recipientId);
			const conversation = response.data.conversation;

			// Update conversations list if it's a new conversation
			setConversations((prev) => {
				const existingIndex = prev.findIndex(c => c._id === conversation._id);
				if (existingIndex === -1) {
					return [conversation, ...prev];
				}
				return prev;
			});

			return conversation;
		} catch (err) {
			throw err;
		}
	}, []);

	const openChat = useCallback(async (recipientId) => {
		try {
			const conversation = await createOrGetConversation(recipientId);
			selectConversation(conversation._id);
			setIsChatModalOpen(true);
		} catch (err) {
			throw err;
		}
	}, [createOrGetConversation, selectConversation]);

	const closeChat = useCallback(() => {
		setIsChatModalOpen(false);
	}, []);

	const openChatModal = useCallback(() => {
		setIsChatModalOpen(true);
	}, []);

	const value = {
		conversations,
		messages,
		activeConversation,
		loading,
		error,
		fetchConversations,
		fetchMessages,
		selectConversation,
		createOrGetConversation,
		isChatModalOpen,
		openChat,
		openChatModal,
		closeChat,
		isSocketConnected,
	};

	return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
