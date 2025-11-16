import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import MessageSidebar from "../components/UI/MessageSidebar";
import ProfileAvatar from "../components/UI/ProfileAvatar";
import ChatMessageItem from "../components/chat/ChatMessageItem";
import ChatInputField from "../components/chat/ChatInputField";
import { sendChatMessage } from "../services/chatSocket.service";

const MessagesPage = () => {
	const { conversationId } = useParams();
	const { user } = useAuth();
	const {
		messages,
		activeConversation,
		selectConversation,
		conversations,
	} = useChat();
	const messagesEndRef = useRef(null);

	useEffect(() => {
		if (conversationId && conversationId !== activeConversation) {
			selectConversation(conversationId);
		}
	}, [conversationId, activeConversation, selectConversation]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const currentMessages = messages[activeConversation] || [];
	const conversation = conversations.find(c => c._id === activeConversation);
	const recipient = conversation?.participant;

	const handleSendMessage = (content) => {
		if (recipient) {
			sendChatMessage(recipient._id, content);
		}
	};

	return (
		<div className="grid grid-cols-4 gap-8">
			<MessageSidebar />
			<div className="col-span-3 bg-gray-900/40 rounded-xl border border-gray-800/50 flex flex-col">
				{activeConversation && recipient ? (
					<>
						<div className="p-4 border-b border-gray-800 flex items-center gap-4">
							<ProfileAvatar
								profilePicture={recipient.profilePicture}
								username={recipient.username}
							/>
							<h2 className="font-bold text-lg text-white">
								{recipient.username}
							</h2>
						</div>
						<div className="flex-1 p-4 space-y-4 overflow-y-auto">
							{currentMessages.map((msg) => (
								<ChatMessageItem
									key={msg._id}
									message={msg}
									isOwn={msg.sender._id === user._id}
								/>
							))}
							<div ref={messagesEndRef} />
						</div>
						<ChatInputField onSend={handleSendMessage} />
					</>
				) : (
					<div className="flex-1 flex items-center justify-center">
						<p className="text-gray-500">
							Select a conversation to start chatting.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default MessagesPage;
