import ProfileAvatar from "../UI/ProfileAvatar";
import { useTimeFormatting } from "../../hooks/useTimeFormatting";

export default function ChatMessageItem({ message, isOwn }) {
	const { formatTime } = useTimeFormatting();

	return (
		<div className={`flex items-end gap-2 mb-3 ${isOwn ? "justify-end" : ""}`}>
			{!isOwn && (
				<ProfileAvatar
					profilePicture={message.sender?.profilePicture}
					username={message.sender?.username}
					size="8"
				/>
			)}
			<div className="flex flex-col gap-1 max-w-[70%]">
				<div
					className={`rounded-2xl px-4 py-2 ${
						isOwn
							? "bg-purple-600 text-white rounded-br-none"
							: "bg-gray-700 text-gray-200 rounded-bl-none"
					}`}
				>
					<p className="text-sm break-words">{message.content}</p>
				</div>
				<span className={`text-xs text-gray-500 px-2 ${isOwn ? "text-right" : "text-left"}`}>
					{formatTime(message.createdAt)}
				</span>
			</div>
			{isOwn && (
				<ProfileAvatar
					profilePicture={message.sender?.profilePicture}
					username={message.sender?.username}
					size="8"
				/>
			)}
		</div>
	);
}
