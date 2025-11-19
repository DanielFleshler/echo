import { UserPlus, UserMinus } from "lucide-react";
import { useState, useEffect } from "react";
import { useTimeFormatting } from "../../hooks/useTimeFormatting";
import { getAnonymousColor } from "../../utils/anonymousUtils";

export default function ChatMessage({ message, previousMessage }) {
	const { formatMessageTime } = useTimeFormatting();
	const [, setTick] = useState(0);

	// Update timestamp every minute
	useEffect(() => {
		const interval = setInterval(() => {
			setTick((prev) => prev + 1);
		}, 60000); // Update every minute

		return () => clearInterval(interval);
	}, []);

	// System message (user join/leave)
	if (message.type === "system") {
		const isJoin = message.content.includes("joined");
		return (
			<div className="flex justify-center my-2 animate-fade-in">
				<div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-full text-xs text-gray-400">
					{isJoin ? (
						<UserPlus className="h-3 w-3 text-green-400" />
					) : (
						<UserMinus className="h-3 w-3 text-gray-500" />
					)}
					<span>{message.content}</span>
				</div>
			</div>
		);
	}

	// Check if this message is from the same user as previous (for grouping)
	const isGrouped =
		previousMessage &&
		previousMessage.type !== "system" &&
		previousMessage.anonymousId === message.anonymousId &&
		previousMessage.isOwn === message.isOwn;

	return (
		<div
			className={`flex ${
				message.isOwn ? "justify-end" : "justify-start"
			} animate-slide-up`}
		>
			<div
				className={`max-w-lg ${
					message.isOwn
						? "bg-purple-600 text-white"
						: "bg-gray-800 text-gray-100"
				} rounded-2xl px-4 py-3 shadow-md transition-all duration-200 hover:shadow-lg ${
					isGrouped ? "mt-1" : "mt-3"
				}`}
			>
				{!message.isOwn && !isGrouped && (
					<div className="flex items-center gap-2 mb-2">
						<span
							className={`px-2 py-1 rounded-full text-xs font-medium ${getAnonymousColor(
								message.anonymousId
							)}`}
						>
							{message.anonymousId}
						</span>
					</div>
				)}
				<p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
					{message.content}
				</p>
				<div
					className={`text-xs mt-2 ${
						message.isOwn ? "text-purple-200" : "text-gray-400"
					}`}
				>
					{formatMessageTime(message.timestamp)}
				</div>
			</div>
		</div>
	);
} 