import { Trash2, Edit2, Save, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import ProfileAvatar from "./ProfileAvatar";

export default function ReplyItem({ reply, postId, commentId, onDelete, onEdit }) {
	const { user } = useAuth();
	const { showSuccess, showError } = useToast();
	const [isDeleting, setIsDeleting] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editedContent, setEditedContent] = useState(reply.content);
	const [isUpdating, setIsUpdating] = useState(false);
	const isAuthor = user && reply.user && user._id === reply.user._id;
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now - date;
		const diffMins = Math.floor(diffMs / (1000 * 60));
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

		if (diffMins < 1) return "Just now";
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;

		return date.toLocaleDateString();
	};

	const handleEdit = () => {
		setIsEditing(true);
		setEditedContent(reply.content);
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
		setEditedContent(reply.content);
	};

	const handleSaveEdit = async () => {
		if (!editedContent.trim() || editedContent.trim() === reply.content) {
			handleCancelEdit();
			return;
		}

		setIsUpdating(true);
		try {
			await onEdit(postId, commentId, reply._id, editedContent.trim());
			setIsEditing(false);
			showSuccess("Reply updated successfully");
		} catch (error) {
			showError(error.message || "Failed to update reply");
		} finally {
			setIsUpdating(false);
		}
	};

	const handleDelete = async () => {
		if (window.confirm("Are you sure you want to delete this reply?")) {
			setIsDeleting(true);
			try {
				await onDelete(postId, commentId, reply._id);
			} catch (error) {
				console.error("Error deleting reply:", error);
			} finally {
				setIsDeleting(false);
			}
		}
	};

	if (isDeleting) {
		return (
			<div className="flex gap-3 py-3 px-2 opacity-50">
				<ProfileAvatar user={reply.user} size="xs" />
				<div className="flex-1 min-w-0">
					<p className="text-sm text-gray-400">Deleting reply...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex items-start gap-3 py-3 px-2 hover:bg-gray-800/20 rounded-md transition-colors duration-200">
			{reply.user && reply.user._id ? (
				<Link to={`/profile/${reply.user._id}`} className="flex items-center">
					<ProfileAvatar user={reply.user} size="xs" />
				</Link>
			) : (
				<ProfileAvatar user={reply.user} size="xs" />
			)}

			<div className="flex-1 min-w-0">
				<div className="flex items-start justify-between">
					<div>
						{reply.user && reply.user._id ? (
							<Link
								to={`/profile/${reply.user._id}`}
								className="font-medium text-white hover:text-purple-400 transition-colors duration-200"
							>
								{reply.user?.fullName || "User"}
							</Link>
						) : (
							<span className="font-medium text-white">
								{reply.user?.fullName || "User"}
							</span>
						)}

						{reply.replyToUser &&
							reply.replyToUser._id &&
							reply.replyToUser._id !== reply.user._id && (
								<>
									<span className="text-gray-500 mx-1">replying to</span>
									<Link
										to={`/profile/${reply.replyToUser._id}`}
										className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
									>
										@{reply.replyToUser.username || "user"}
									</Link>
								</>
							)}

						<span className="ml-2 text-xs text-gray-400">
							{formatDate(reply.createdAt)}
						</span>
					</div>

					{isAuthor && !isEditing && (
						<div className="flex gap-1">
							<button
								onClick={handleEdit}
								disabled={isDeleting}
								className="rounded-full p-1.5 text-gray-500 hover:bg-gray-800/70 hover:text-blue-400 transition-colors duration-200"
								aria-label="Edit reply"
							>
								<Edit2 className="h-3 w-3" />
							</button>
							<button
								onClick={handleDelete}
								disabled={isDeleting}
								className="rounded-full p-1.5 text-gray-500 hover:bg-gray-800/70 hover:text-red-400 transition-colors duration-200"
								aria-label="Delete reply"
							>
								<Trash2 className="h-3 w-3" />
							</button>
						</div>
					)}
				</div>

				{isEditing ? (
					<div className="mt-2">
						<textarea
							value={editedContent}
							onChange={(e) => setEditedContent(e.target.value)}
							className="w-full rounded-lg border border-gray-800/80 bg-gray-900/50 px-3 py-2 text-xs text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors duration-200 resize-none"
							rows={2}
							disabled={isUpdating}
						/>
						<div className="flex gap-2 mt-2">
							<button
								onClick={handleSaveEdit}
								disabled={isUpdating || !editedContent.trim()}
								className="flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all duration-200"
							>
								<Save className="h-3 w-3" />
								<span>Save</span>
							</button>
							<button
								onClick={handleCancelEdit}
								disabled={isUpdating}
								className="flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 transition-all duration-200"
							>
								<X className="h-3 w-3" />
								<span>Cancel</span>
							</button>
						</div>
					</div>
				) : (
					<p className="mt-1 text-xs text-gray-300 break-words">
						{reply.content}
					</p>
				)}
			</div>
		</div>
	);
}
