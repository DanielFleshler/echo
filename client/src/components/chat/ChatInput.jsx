import { Send, AlertCircle } from "lucide-react";
import { useState, useRef } from "react";
import { CHAT_CONFIG } from "../../constants/config";

const MAX_MESSAGE_LENGTH = CHAT_CONFIG.MAX_MESSAGE_LENGTH;

export default function ChatInput({
	onSendMessage,
	disabled = false,
	isConnected = true,
	placeholder = "Type a message...",
	multiline = false,
	showHint = false,
	variant = "default", // "default" or "compact"
}) {
	const [message, setMessage] = useState("");
	const [isSending, setIsSending] = useState(false);
	const textareaRef = useRef(null);
	const inputRef = useRef(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const trimmedMessage = message.trim();

		if (!trimmedMessage || isSending || disabled || trimmedMessage.length > MAX_MESSAGE_LENGTH) {
			return;
		}

		setIsSending(true);
		try {
			await onSendMessage(trimmedMessage);
			setMessage("");
			// Reset textarea height for multiline mode
			if (multiline && textareaRef.current) {
				textareaRef.current.style.height = "auto";
			}
		} catch (error) {
			console.error("Error sending message:", error);
		} finally {
			setIsSending(false);
		}
	};

	const handleChange = (e) => {
		const value = e.target.value;
		// Allow typing but enforce max on submit
		setMessage(value);

		// Auto-resize textarea in multiline mode
		if (multiline && textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	};

	const handleKeyDown = (e) => {
		if (multiline && e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	};

	const displayPlaceholder = !isConnected ? "Connecting to chat server..." : placeholder;
	const remainingChars = MAX_MESSAGE_LENGTH - message.length;
	const showCharCount = message.length > MAX_MESSAGE_LENGTH * 0.8;
	const isOverLimit = message.length > MAX_MESSAGE_LENGTH;

	// Variant styles
	const containerClasses = variant === "compact"
		? "p-4 border-t border-gray-800 bg-gray-900/50"
		: "border-t border-gray-800 bg-gray-900/80 backdrop-blur-md";

	const innerContainerClasses = variant === "compact"
		? ""
		: "container max-w-4xl mx-auto px-4 py-4";

	const inputClasses = variant === "compact"
		? "w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
		: "w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none max-h-32 min-h-[48px]";

	const buttonClasses = variant === "compact"
		? "rounded-lg bg-purple-600 p-2 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
		: "self-end p-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex-shrink-0";

	return (
		<div className={containerClasses}>
			<div className={innerContainerClasses}>
				<form onSubmit={handleSubmit} className={`flex ${variant === "compact" ? "gap-2" : "gap-3"} items-${multiline ? "end" : "center"}`}>
					<div className="flex-1 relative">
						{multiline ? (
							<textarea
								ref={textareaRef}
								value={message}
								onChange={handleChange}
								onKeyDown={handleKeyDown}
								placeholder={displayPlaceholder}
								rows={1}
								disabled={isSending || disabled}
								className={inputClasses}
							/>
						) : (
							<input
								ref={inputRef}
								type="text"
								value={message}
								onChange={handleChange}
								placeholder={displayPlaceholder}
								disabled={isSending || disabled}
								className={inputClasses}
							/>
						)}
						{showCharCount && (
							<span className={`absolute right-2 top-1/2 -translate-y-1/2 text-xs pointer-events-none ${
								isOverLimit ? 'text-red-400 font-semibold' : remainingChars < 100 ? 'text-yellow-400' : 'text-gray-500'
							}`}>
								{remainingChars}
							</span>
						)}
					</div>
					<button
						type="submit"
						disabled={!message.trim() || isSending || disabled || isOverLimit}
						className={buttonClasses}
						aria-label="Send message"
					>
						{isSending ? (
							<div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
						) : (
							<Send className="h-5 w-5" />
						)}
					</button>
				</form>

				{!isConnected && (
					<p className="text-xs text-red-400 mt-2">
						Waiting for connection to chat server...
					</p>
				)}

				{showHint && (
					<div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
						<AlertCircle className="h-3 w-3" />
						<span>
							{multiline
								? "Press Enter to send, Shift+Enter for new line. Be respectful and kind."
								: "Be respectful and kind."
							}
						</span>
					</div>
				)}
			</div>
		</div>
	);
}
