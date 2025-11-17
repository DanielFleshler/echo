import {
	ChevronDown,
	ChevronUp,
	Clock,
	Edit2,
	Eye,
	MessageCircle,
	Send,
	Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usePost } from "../../context/PostContext";
import { useToast } from "../../context/ToastContext";
import { useViewTracking } from "../../context/ViewTrackingContext";
import Card from "./Card";
import CommentSection from "./CommentSection";
import PostForm from "./PostForm";
import ProfileAvatar from "./ProfileAvatar";

export default function PostItem({
	post,
	currentUser,
	showActions = true,
	onDelete,
	onRenew,
	onEdit,
}) {
	const { user } = useAuth();
	const [isDeleting, setIsDeleting] = useState(false);
	const [isRenewing, setIsRenewing] = useState(false);
	const [showComments, setShowComments] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showAllMedia, setShowAllMedia] = useState(false);
	const [videoModalUrl, setVideoModalUrl] = useState(null);

	const { showSuccess, showError, showInfo } = useToast();
	const { trackView, getViewCount, initializeViewCount } = useViewTracking();
	const { updatePost, deletePost, renewPost, addComment, updateComment, deleteComment } =
		usePost();

	const initializedRef = useRef(false);
	const viewTrackedRef = useRef(false);  // Use ref instead of state to prevent double-tracking
	const isOwnPost = user._id === post.user?._id;
	const commentCount = post.comments ? post.comments.length : 0;
	const isMounted = useRef(true);

	// Add cleanup for the component
	useEffect(() => {
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		if (!initializedRef.current) {
			initializedRef.current = true;
			initializeViewCount(post._id, post.views || 0);
		}
		// initializeViewCount is a stable callback, don't include it in deps
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [post._id, post.views]);

	useEffect(() => {
		// Only track views once and only for non-expired posts
		// Don't track views on own posts
		// Use ref to prevent double-tracking in React.StrictMode
		if (!viewTrackedRef.current && !post.expired && !isOwnPost) {
			viewTrackedRef.current = true;  // Set immediately to prevent double-tracking
			trackView(post._id);
		}

		// trackView is a stable callback, don't include it in deps
		// The viewTrackedRef guard prevents multiple calls
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [post._id, post.expired, isOwnPost]);

	// Handle Escape key to close video modal
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === "Escape" && videoModalUrl) {
				setVideoModalUrl(null);
			}
		};

		if (videoModalUrl) {
			document.addEventListener("keydown", handleEscape);
			return () => document.removeEventListener("keydown", handleEscape);
		}
	}, [videoModalUrl]);

	const viewCount = getViewCount(post._id) || post.views || 0;

	const handleDelete = async () => {
		if (window.confirm("Are you sure you want to delete this post?")) {
			setIsDeleting(true);
			try {
				if (onDelete) {
					await onDelete(post._id);
				} else {
					await deletePost(post._id);
				}
			} catch (error) {
				console.error("Error deleting post:", error);
				if (isMounted.current) {
					showError(error.message || "Failed to delete post");
				}
			} finally {
				if (isMounted.current) {
					setIsDeleting(false);
				}
			}
		}
	};

	const handleRenew = async () => {
		setIsRenewing(true);
		try {
			const renewedPost = await renewPost(post._id);
			if (onRenew && isMounted.current) {
				onRenew(post._id);
			}
			return renewedPost;
		} catch (error) {
			console.error("Error renewing post:", error);
			if (isMounted.current) {
				showError(error.message || "Failed to renew post");
			}
		} finally {
			if (isMounted.current) {
				setIsRenewing(false);
			}
		}
	};

	const handleEdit = async (updatedPostData) => {
		setIsSubmitting(true);
		try {
			const updatedPost = await updatePost(post._id, updatedPostData);
			if (isMounted.current) {
				setIsEditing(false);
				if (onEdit) {
					onEdit(updatedPost);
				}
			}
			return updatedPost;
		} catch (error) {
			console.error("Error updating post:", error);
			if (isMounted.current) {
				showError(error.message || "Failed to update post");
			}
		} finally {
			if (isMounted.current) {
				setIsSubmitting(false);
			}
		}
	};

	const handleShare = () => {
		const postUrl = `${window.location.origin}/post/${post._id}`;
		navigator.clipboard
			.writeText(postUrl)
			.then(() => {
				if (isMounted.current) {
					showInfo("Post link copied to clipboard");
				}
			})
			.catch(() => {
				if (isMounted.current) {
					showError("Failed to copy link");
				}
			});
	};

	const getHoursLeft = () => {
		if (!post.expiresAt) return 0;
		return Math.ceil(
			(new Date(post.expiresAt) - new Date()) / (1000 * 60 * 60)
		);
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		})}`;
	};

	if (isEditing) {
		return (
			<Card className="mb-3 sm:mb-4 p-3 sm:p-4">
				<div className="mb-3 flex items-center justify-between">
					<div className="flex items-center gap-2 sm:gap-3">
						<ProfileAvatar user={post.user || currentUser} size="sm" />
						<h3 className="font-medium text-white text-sm sm:text-base">Edit Post</h3>
					</div>
					<button
						onClick={() => setIsEditing(false)}
						className="text-xs sm:text-sm text-gray-400 hover:text-purple-400 touch-manipulation p-2"
					>
						Cancel
					</button>
				</div>

				<PostForm
					user={currentUser}
					initialContent={post.content}
					initialDuration={getHoursLeft()}
					initialMedia={post.media || []}
					isEditing={true}
					onSubmit={handleEdit}
					isSubmitting={isSubmitting}
				/>
			</Card>
		);
	}

	return (
		<Card className="mb-3 sm:mb-4 p-3 sm:p-4 lg:p-5 overflow-visible">
			<div className="mb-3 sm:mb-4 flex items-start sm:items-center justify-between gap-2">
				<div className="flex items-center gap-2 sm:gap-3">
					<ProfileAvatar user={post.user || currentUser} size="sm" />
					<div className="min-w-0 flex-1">
						{post.user && post.user._id ? (
							<Link
								to={`/profile/${post.user._id}`}
								className="font-medium text-white hover:text-purple-400 transition-colors duration-200 text-sm sm:text-base block truncate"
							>
								{post.user?.fullName || currentUser?.fullName || "User"}
							</Link>
						) : (
							<h3 className="font-medium text-white text-sm sm:text-base truncate">
								{post.user?.fullName || currentUser?.fullName || "User"}
							</h3>
						)}
						<p className="text-xs text-gray-400 mt-0.5 truncate">
							{formatDate(post.createdAt)}
						</p>
					</div>
				</div>

				{!post.expired ? (
					<div className="flex items-center gap-1 sm:gap-1.5 rounded-full bg-purple-900/30 px-2 sm:px-3 py-1 text-xs font-medium text-purple-400 shadow-sm border border-purple-900/20 flex-shrink-0">
						<Clock className="h-3 w-3" />
						<span className="hidden xs:inline sm:inline">{getHoursLeft()}h left</span>
						<span className="xs:hidden">{getHoursLeft()}h</span>
					</div>
				) : (
					<div className="flex items-center gap-1 sm:gap-1.5 rounded-full bg-gray-800/70 px-2 sm:px-3 py-1 text-xs font-medium text-gray-400 border border-gray-800/50 flex-shrink-0">
						<Clock className="h-3 w-3" />
						<span>Expired</span>
					</div>
				)}
			</div>

			{/* Post Content */}
			<div className="mb-3 sm:mb-4">
				<p className="text-white/90 whitespace-pre-wrap break-words text-sm sm:text-base">{post.content}</p>
			</div>

			{/* Post Media - Modern Style */}
			{post.media && post.media.length > 0 && (
				<div className="mb-3 sm:mb-4 overflow-hidden rounded-lg sm:rounded-xl bg-gray-900/30">
					{post.media.length === 1 ? (
						<div className="aspect-video relative">
							{(post.media[0].type === "image" || post.media[0].type?.startsWith("image/")) && (
								<img
									src={post.media[0].url}
									alt="Post media"
									className="h-full w-full object-cover"
								/>
							)}
							{(post.media[0].type === "video" || post.media[0].type?.startsWith("video/")) && (
								<video
									src={post.media[0].url}
									controls
									className="h-full w-full object-cover bg-black"
								>
									Your browser does not support the video tag.
								</video>
							)}
						</div>
					) : (
						<>
							<div className={`grid gap-1 ${
								showAllMedia && post.media.length > 4 ? 'grid-cols-4' :
								post.media.length === 2 ? 'grid-cols-2' : 
								post.media.length === 3 ? 'grid-cols-3' : 
								'grid-cols-2 grid-rows-2'
							}`}>
								{post.media.map((mediaItem, index) => {
									// Show first 4 in grid view or all if showAllMedia is true
									if (!showAllMedia && index > 3) return null;
									if (showAllMedia && index > 4) return null; // Cap at 5 visible items max
									
									const isFirstItemInGridOfMany = post.media.length > 3 && index === 0;
									
									return (
										<div
											key={`media-${mediaItem._id || mediaItem.publicId || index}-${Date.now()}`}
											className={`overflow-hidden relative ${isFirstItemInGridOfMany ? 'col-span-1 row-span-1' : ''}`}
										>
											{(mediaItem.type === "image" || mediaItem.type?.startsWith("image/")) && (
												<div className="aspect-square">
													<img
														src={mediaItem.url}
														alt={`Post media ${index + 1}`}
														className="h-full w-full object-cover"
													/>
												</div>
											)}
											{(mediaItem.type === "video" || mediaItem.type?.startsWith("video/")) && (
												<div className="aspect-square relative">
													<video
														src={mediaItem.url}
														className="h-full w-full object-cover bg-black"
													>
														Your browser does not support the video tag.
													</video>
													<div className="absolute inset-0 flex items-center justify-center">
														<button
															onClick={(e) => {
																e.stopPropagation();
																setVideoModalUrl(mediaItem.url);
															}}
															className="h-12 w-12 rounded-full bg-black/50 flex items-center justify-center text-white"
														>
															<Send className="h-5 w-5 transform rotate-90" />
														</button>
													</div>
												</div>
											)}
											{!showAllMedia && post.media.length > 4 && index === 3 && (
												<div className="absolute inset-0 bg-black/60 flex items-center justify-center">
													<span className="text-white text-xl font-bold">+{post.media.length - 4}</span>
												</div>
											)}
										</div>
									);
								})}
							</div>
							{post.media.length > 4 && (
								<div className="mt-2 px-2 pb-2">
									<button 
										onClick={() => setShowAllMedia(!showAllMedia)}
										className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
									>
										{showAllMedia ? "Show less" : `Show all ${post.media.length} media items`}
									</button>
								</div>
							)}
						</>
					)}
				</div>
			)}

			{/* Post Actions */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3 sm:gap-4">
					{/* View count */}
					<div className="flex items-center gap-1 sm:gap-1.5 text-gray-400 text-sm">
						<Eye className="h-4 w-4 sm:h-4 sm:w-4" aria-hidden="true" />
						<span>{viewCount}</span>
					</div>

					{/* Comment button */}
					<button
						onClick={() => setShowComments(!showComments)}
						className="flex items-center gap-1 sm:gap-1.5 text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm touch-manipulation p-1 -m-1"
						aria-label={`${commentCount} comments`}
						aria-expanded={showComments}
					>
						<MessageCircle className="h-4 w-4 sm:h-4 sm:w-4" aria-hidden="true" />
						<span>{commentCount}</span>
					</button>
				</div>

				{/* Admin actions */}
				{showActions && isOwnPost && !post.expired && (
					<div className="flex items-center gap-1.5 sm:gap-2">
						<button
							onClick={() => setIsEditing(true)}
							className="rounded-md bg-gray-800 p-2 sm:px-2.5 sm:py-1.5 text-xs font-medium text-white hover:bg-gray-700 transition-colors duration-200 touch-manipulation"
							aria-label="Edit post"
						>
							<Edit2 className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
							<span className="sr-only">Edit</span>
						</button>
						<button
							onClick={handleDelete}
							disabled={isDeleting}
							className="rounded-md bg-red-900/30 p-2 sm:px-2.5 sm:py-1.5 text-xs font-medium text-red-400 hover:bg-red-900/50 transition-colors duration-200 touch-manipulation disabled:opacity-50"
							aria-label="Delete post"
						>
							<Trash2 className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
							<span className="sr-only">Delete</span>
						</button>
					</div>
				)}

				{/* Renew Post button */}
				{showActions && post.expired && isOwnPost && (
					<button
						onClick={handleRenew}
						disabled={isRenewing}
						className="rounded-md bg-gradient-to-r from-purple-600 to-blue-600 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white hover:from-purple-700 hover:to-blue-700 disabled:opacity-70 transition-colors duration-200 touch-manipulation"
						aria-label="Renew post"
					>
						{isRenewing ? "Renewing..." : "Renew Post"}
					</button>
				)}
			</div>

			{/* Comments section */}
			{showComments && (
				<div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-800/50">
					<CommentSection
						post={post}
						onAddComment={addComment}
						onEditComment={updateComment}
						onDeleteComment={deleteComment}
						currentUser={user}
					/>
				</div>
			)}

			{/* Video Modal */}
			{videoModalUrl && (
				<div
					className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
					onClick={() => setVideoModalUrl(null)}
					role="dialog"
					aria-label="Video player"
				>
					<button
						onClick={() => setVideoModalUrl(null)}
						className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors touch-manipulation"
						aria-label="Close video"
					>
						×
					</button>
					<video
						src={videoModalUrl}
						className="max-h-full max-w-full rounded-lg"
						controls
						autoPlay
						onClick={(e) => e.stopPropagation()}
					>
						Your browser does not support the video tag.
					</video>
				</div>
			)}
		</Card>
	);
}
