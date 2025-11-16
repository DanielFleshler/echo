import { MessageSquare, PlusCircle, Search, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useChat } from "../../context/ChatContext";
import ProfileAvatar from "./ProfileAvatar";
import LoadingSpinner from "./LoadingSpinner";
import { useTimeFormatting } from "../../hooks/useTimeFormatting";

const ConversationItem = ({ convo, onSelect }) => {
	const { formatTime } = useTimeFormatting();

	if (!convo.participant) {
		// This can happen if a user in a conversation is deleted
		return null;
	}

	return (
		<div
			onClick={() => onSelect(convo._id)}
			className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800/50 cursor-pointer transition-colors duration-200"
		>
			<ProfileAvatar
				profilePicture={convo.participant.profilePicture}
				username={convo.participant.username}
				size="10"
			/>
			<div className="flex-1 min-w-0">
				<p className="font-medium text-white truncate">
					{convo.participant.username}
				</p>
				{convo.lastMessage ? (
					<p className="text-xs text-gray-400 truncate">
						{convo.lastMessage.content}
					</p>
				) : (
					<p className="text-xs text-gray-500 italic">No messages yet</p>
				)}
			</div>
			{convo.lastMessage && (
				<div className="text-xs text-gray-500 self-start">
					{formatTime(convo.lastMessage.createdAt)}
				</div>
			)}
			{/* Unread indicator could be added here */}
		</div>
	);
};

export default function MessageSidebar() {
	const { conversations, loading, selectConversation, openChatModal } = useChat();

	const handleSelect = (conversationId) => {
		selectConversation(conversationId);
		openChatModal();
	};

	return (
		<div className="col-span-1">
			<div className="sticky top-20 rounded-xl border border-gray-800/50 bg-gray-900/40 backdrop-blur-sm p-5 shadow-xl">
				<div className="mb-4 flex items-center justify-between">
					<h3 className="font-medium text-white flex items-center gap-2">
						<MessageSquare className="h-5 w-5 text-purple-400" />
						Messages
					</h3>
					<button className="rounded-full p-1 hover:bg-gray-800/70 text-purple-400 transition-colors duration-200">
						<PlusCircle className="h-5 w-5" />
					</button>
				</div>

				<div className="relative">
					<input
						type="text"
						placeholder="Search messages"
						className="w-full rounded-lg border border-gray-800/80 bg-gray-900/50 pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors duration-200"
					/>
					<Search className="absolute left-3 top-2 h-4 w-4 text-gray-500" />
				</div>

				<div className="mt-4 space-y-2">
					{loading ? (
						<div className="flex justify-center py-4">
							<LoadingSpinner />
						</div>
					) : conversations.length > 0 ? (
						conversations.map((convo) => (
							<ConversationItem
								key={convo._id}
								convo={convo}
								onSelect={handleSelect}
							/>
						))
					) : (
						<div className="text-center py-4">
							<p className="text-sm text-gray-500">No conversations yet.</p>
							<p className="text-xs text-gray-600 mt-1">
								Start a chat from a user's profile.
							</p>
						</div>
					)}
				</div>

				<div className="mt-6 text-center">
					<Link
						to="/profile"
						className="mt-4 inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
					>
						<Users className="h-4 w-4" />
						View your profile
					</Link>
				</div>
			</div>
		</div>
	);
}
