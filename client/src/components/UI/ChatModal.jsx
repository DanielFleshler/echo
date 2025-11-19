import { X, WifiOff, Wifi, ArrowLeft } from "lucide-react";
import { useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { sendChatMessage } from "../../services/chatSocket.service";
import ProfileAvatar from "./ProfileAvatar";
import ChatMessageItem from "../chat/ChatMessageItem";
import ChatInputField from "../chat/ChatInputField";

export default function ChatModal({ isOpen, onClose }) {
	const { user } = useAuth();
	const {
		messages,
		activeConversation,
		conversations,
		selectConversation,
		fetchMessages,
		isSocketConnected,
	} = useChat();
	const messagesEndRef = useRef(null);
	const modalRef = useRef(null);

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, activeConversation]);

	// Close modal on outside click
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (modalRef.current && !modalRef.current.contains(e.target)) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			return () => document.removeEventListener("mousedown", handleClickOutside);
		}
	}, [isOpen, onClose]);

	// Close on Escape key
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			return () => document.removeEventListener("keydown", handleEscape);
		}
	}, [isOpen, onClose]);

	const currentMessages = activeConversation ? messages[activeConversation] || [] : [];
	const conversation = conversations.find((c) => c._id === activeConversation);
	const recipient = conversation?.participant;

	const handleSendMessage = (content) => {
		if (!recipient) {
			return;
		}
		sendChatMessage(recipient._id, content);
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-gray-950/80 backdrop-blur-sm">
			<div
				ref={modalRef}
				className="bg-gray-900 border border-gray-800 rounded-xl shadow-xl w-full max-w-4xl h-[calc(100vh-1rem)] md:h-[600px] flex flex-col overflow-hidden"
			>
				{/* Header */}
				<div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
					<div className="flex items-center gap-3">
						{/* Back button for mobile */}
						{activeConversation && recipient && (
							<button
								onClick={() => selectConversation(null)}
								className="md:hidden p-1 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
							>
								<ArrowLeft className="h-5 w-5" />
							</button>
						)}
						{recipient ? (
							<>
								<ProfileAvatar
									profilePicture={recipient.profilePicture}
									username={recipient.username}
									size="10"
								/>
								<div>
									<h2 className="text-lg font-semibold text-white">
										{recipient.username}
									</h2>
									{recipient.online && (
										<p className="text-xs text-green-400">Online</p>
									)}
								</div>
							</>
						) : (
							<h2 className="text-lg font-semibold text-white">Messages</h2>
						)}
					</div>
					<div className="flex items-center gap-3">
						{/* Connection Status Indicator */}
						<div className={`flex items-center gap-1 text-xs ${isSocketConnected ? 'text-green-400' : 'text-red-400'}`}>
							{isSocketConnected ? (
								<>
									<Wifi className="h-4 w-4" />
									<span>Connected</span>
								</>
							) : (
								<>
									<WifiOff className="h-4 w-4" />
									<span>Connecting...</span>
								</>
							)}
						</div>
						<button
							onClick={onClose}
							className="p-1 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
						>
							<X className="h-5 w-5" />
						</button>
					</div>
				</div>

				<div className="flex flex-1 overflow-hidden">
					{/* Conversations List */}
					<div className={`${activeConversation ? 'hidden md:block' : 'block'} w-full md:w-1/3 border-r border-gray-800 overflow-y-auto`}>
						{conversations.length > 0 ? (
							conversations.map((convo) => (
								<div
									key={convo._id}
									onClick={() => selectConversation(convo._id)}
									className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
										activeConversation === convo._id
											? "bg-gray-800/70"
											: "hover:bg-gray-800/50"
									}`}
								>
									<ProfileAvatar
										profilePicture={convo.participant?.profilePicture}
										username={convo.participant?.username}
										size="10"
									/>
									<div className="flex-1 min-w-0">
										<p className="font-medium text-white truncate">
											{convo.participant?.username}
										</p>
										{convo.lastMessage ? (
											<p className="text-xs text-gray-400 truncate">
												{convo.lastMessage.content}
											</p>
										) : (
											<p className="text-xs text-gray-500 italic">
												No messages yet
											</p>
										)}
									</div>
								</div>
							))
						) : (
							<div className="text-center py-8 px-4">
								<p className="text-sm text-gray-500">No conversations yet.</p>
								<p className="text-xs text-gray-600 mt-1">
									Start a chat from a user's profile!
								</p>
							</div>
						)}
					</div>

					{/* Chat Area */}
					<div className={`${activeConversation ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
						{activeConversation && recipient ? (
							<>
								{/* Messages */}
								<div className="flex-1 p-4 overflow-y-auto">
									{currentMessages.length > 0 ? (
										currentMessages.map((msg) => (
											<ChatMessageItem
												key={msg._id}
												message={msg}
												isOwn={msg.sender?._id === user?._id}
											/>
										))
									) : (
										<div className="flex items-center justify-center h-full">
											<p className="text-gray-500 text-sm">
												No messages yet. Start the conversation!
											</p>
										</div>
									)}
									<div ref={messagesEndRef} />
								</div>
								{/* Input */}
								<ChatInputField
									onSend={handleSendMessage}
									disabled={!recipient || !isSocketConnected}
									isConnected={isSocketConnected}
								/>
							</>
						) : (
							<div className="flex-1 flex items-center justify-center">
								<p className="text-gray-500">
									Select a conversation to start chatting
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
