import { useState } from "react";
import { Send } from "lucide-react";
import { CHAT_CONFIG } from "../../constants/config";

const MAX_MESSAGE_LENGTH = CHAT_CONFIG.MAX_MESSAGE_LENGTH;

export default function ChatInputField({ onSend, disabled, isConnected = true, placeholder = "Type a message..." }) {
	const [message, setMessage] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		const trimmedMessage = message.trim();

		if (trimmedMessage && !disabled && trimmedMessage.length <= MAX_MESSAGE_LENGTH) {
			onSend(trimmedMessage);
			setMessage("");
		}
	};

	const handleChange = (e) => {
		const value = e.target.value;
		if (value.length <= MAX_MESSAGE_LENGTH) {
			setMessage(value);
		}
	};

	const displayPlaceholder = !isConnected ? "Connecting to chat server..." : placeholder;
	const remainingChars = MAX_MESSAGE_LENGTH - message.length;
	const showCharCount = message.length > MAX_MESSAGE_LENGTH * 0.8;

	return (
		<form onSubmit={handleSubmit} className="p-4 border-t border-gray-800 bg-gray-900/50">
			<div className="flex gap-2 items-center">
				<div className="flex-1 relative">
					<input
						type="text"
						value={message}
						onChange={handleChange}
						placeholder={displayPlaceholder}
						disabled={disabled}
						className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
					/>
					{showCharCount && (
						<span className={`absolute right-2 top-1/2 -translate-y-1/2 text-xs ${remainingChars < 100 ? 'text-red-400' : 'text-gray-500'}`}>
							{remainingChars}
						</span>
					)}
				</div>
				<button
					type="submit"
					disabled={!message.trim() || disabled}
					className="rounded-lg bg-purple-600 p-2 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					aria-label="Send message"
				>
					<Send className="h-5 w-5" />
				</button>
			</div>
			{!isConnected && (
				<p className="text-xs text-red-400 mt-2">
					Waiting for connection to chat server...
				</p>
			)}
		</form>
	);
}
