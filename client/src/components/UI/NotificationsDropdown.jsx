import { Bell, Clock, Heart, MessageCircle, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function NotificationsDropdown({
	isOpen,
	onClose,
	anchorRect,
	onNotificationUpdate,
}) {
	const [notifications, setNotifications] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingMore, setLoadingMore] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [hasMore, setHasMore] = useState(false);
	const dropdownRef = useRef(null);
	const navigate = useNavigate();

	// Fetch notifications when dropdown opens
	useEffect(() => {
		if (isOpen) {
			setCurrentPage(1);
			setHasMore(false);
			fetchNotifications(1);
		}
	}, [isOpen]);

	const fetchNotifications = async (page = 1) => {
		if (page === 1) {
			setLoading(true);
		} else {
			setLoadingMore(true);
		}

		try {
			const response = await api.get(`/notifications?page=${page}`);
			const { notifications: newNotifications, pagination } =
				response.data.data;

			if (page === 1) {
				// First page: replace notifications
				setNotifications(newNotifications);
			} else {
				// Subsequent pages: append notifications
				setNotifications((prev) => [...prev, ...newNotifications]);
			}

			setCurrentPage(page);
			setHasMore(pagination.hasMore);
		} catch (error) {
			console.error("Error fetching notifications:", error);
		} finally {
			setLoading(false);
			setLoadingMore(false);
		}
	};

	const loadMore = () => {
		fetchNotifications(currentPage + 1);
	};

	const handleMarkAsRead = async (notificationId) => {
		try {
			await api.patch(`/notifications/${notificationId}/read`);
			// Update local state
			setNotifications((prev) =>
				prev.map((notif) =>
					notif._id === notificationId ? { ...notif, read: true } : notif
				)
			);
			onNotificationUpdate?.();
		} catch (error) {
			console.error("Error marking notification as read:", error);
		}
	};

	const handleMarkAllAsRead = async () => {
		try {
			await api.patch("/notifications/mark-all-read");
			// Update all notifications to read
			setNotifications((prev) =>
				prev.map((notif) => ({ ...notif, read: true }))
			);
			onNotificationUpdate?.();
		} catch (error) {
			console.error("Error marking all notifications as read:", error);
		}
	};

	const handleNotificationClick = (notification) => {
		// Mark as read
		if (!notification.read) {
			handleMarkAsRead(notification._id);
		}

		// Navigate based on notification type
		if (notification.type === "follow") {
			navigate(`/profile/${notification.sender._id}`);
		} else if (
			notification.type === "comment" ||
			notification.type === "reply"
		) {
			navigate(`/post/${notification.post}`);
		}

		onClose();
	};

	// Helper: Get icon based on notification type
	const getNotificationIcon = (type) => {
		switch (type) {
			case "follow":
				return <User className="h-4 w-4 text-purple-400" />;
			case "comment":
				return <MessageCircle className="h-4 w-4 text-blue-400" />;
			case "reply":
				return <MessageCircle className="h-4 w-4 text-blue-400" />;
			case "like":
				return <Heart className="h-4 w-4 text-red-400" />;
			default:
				return <Bell className="h-4 w-4 text-gray-400" />;
		}
	};

	// Helper: Get notification content text
	const getNotificationContent = (notification) => {
		switch (notification.type) {
			case "follow":
				return "started following you";
			case "comment":
				return "commented on your post";
			case "reply":
				return "replied to your comment";
			case "like":
				return "liked your post";
			default:
				return "sent you a notification";
		}
	};

	// Helper: Format time as "2 minutes ago"
	const formatTimeAgo = (timestamp) => {
		const now = new Date();
		const past = new Date(timestamp);
		const diffInSeconds = Math.floor((now - past) / 1000);

		if (diffInSeconds < 60) return "Just now";
		if (diffInSeconds < 3600) {
			const mins = Math.floor(diffInSeconds / 60);
			return `${mins} minute${mins > 1 ? "s" : ""} ago`;
		}
		if (diffInSeconds < 86400) {
			const hours = Math.floor(diffInSeconds / 3600);
			return `${hours} hour${hours > 1 ? "s" : ""} ago`;
		}
		if (diffInSeconds < 604800) {
			const days = Math.floor(diffInSeconds / 86400);
			return `${days} day${days > 1 ? "s" : ""} ago`;
		}
		return past.toLocaleDateString();
	};

	// Close the dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				onClose();
			}
		}

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	// Position the notifications dropdown relative to the navbar button
	const isMobile = window.innerWidth < 768;
	const style = anchorRect && !isMobile
		? {
				position: "fixed",
				top: `${anchorRect.bottom + 12}px`,
				left: anchorRect.left - 280 + anchorRect.width / 2,
				zIndex: 100,
				width: "320px",
		  }
		: isMobile
		? {
				position: "fixed",
				top: `${anchorRect?.bottom || 56}px`,
				left: "50%",
				transform: "translateX(-50%)",
				zIndex: 100,
				width: "calc(100vw - 1rem)",
				maxWidth: "400px",
		  }
		: {};

	return (
		<>
			<div
				className="fixed inset-0 z-40 bg-transparent"
				onClick={onClose}
			></div>
			<div
				ref={dropdownRef}
				className="rounded-xl border border-gray-800/50 bg-gray-900/90 backdrop-blur-sm shadow-xl transform
  transition-all duration-200 ease-out z-50 overflow-hidden"
				style={{
					...style,
					boxShadow: "0 10px 25px rgba(0, 0, 0, 0.4)",
				}}
			>
				{/* Small decorative arrow pointing up to navbar - hide on mobile */}
				{!isMobile && (
					<div
						className="absolute w-4 h-4 bg-gray-900/90 backdrop-blur-sm border-t border-l border-gray-800/50 transform
  rotate-45 -translate-y-2"
						style={{
							top: "0",
							right: "24px",
						}}
					></div>
				)}

				<div className="max-h-96 overflow-y-auto hide-scrollbar">
					{/* Header */}
					<div
						className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800/50 p-3.5 flex 
  justify-between items-center"
					>
						<h3 className="font-medium text-white flex items-center gap-2">
							<Bell className="h-4 w-4 text-purple-400" />
							Notifications
						</h3>
						<button
							onClick={handleMarkAllAsRead}
							className="text-xs text-purple-400 hover:text-purple-300 transition-colors duration-200"
						>
							Mark all as read
						</button>
					</div>

					{/* Notifications List */}
					{loading ? (
						<div className="py-12 text-center">
							<div
								className="mx-auto mb-4 h-14 w-14 rounded-full bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-4 
  flex items-center justify-center"
							>
								<Bell className="h-6 w-6 text-gray-500 animate-pulse" />
							</div>
							<p className="text-sm text-gray-400">Loading notifications...</p>
						</div>
					) : notifications.length > 0 ? (
						<div>
							{notifications.map((notification) => (
								<div
									key={notification._id}
									className={`p-3.5 border-b border-gray-800/30 hover:bg-gray-800/50 transition-colors duration-200 flex gap-3
   items-start cursor-pointer ${!notification.read ? "bg-gray-800/20" : ""}`}
									onClick={() => handleNotificationClick(notification)}
								>
									<div
										className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-700/30 to-blue-700/30 flex items-center 
  justify-center flex-shrink-0 shadow-sm"
									>
										{getNotificationIcon(notification.type)}
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm text-gray-300">
											<span className="font-medium text-white">
												{notification.sender?.fullName || "Deleted User"}
											</span>{" "}
											{getNotificationContent(notification)}
										</p>
										<p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
											<Clock className="h-3 w-3" />
											{formatTimeAgo(notification.createdAt)}
										</p>
									</div>
									{!notification.read && (
										<div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0 mt-1 shadow-sm shadow-purple-500/50"></div>
									)}
								</div>
							))}
						</div>
					) : (
						<div className="py-12 text-center">
							<div
								className="mx-auto mb-4 h-14 w-14 rounded-full bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-4 
  flex items-center justify-center"
							>
								<Bell className="h-6 w-6 text-gray-500" />
							</div>
							<h3 className="text-base font-medium text-white">
								No notifications
							</h3>
							<p className="mt-2 text-sm text-gray-400">
								You're all caught up!
							</p>
						</div>
					)}

					{/* Load More Button */}
					{hasMore && (
						<div className="p-3.5 text-center border-t border-gray-800/50 bg-gray-900/70">
							<button
								onClick={loadMore}
								disabled={loadingMore}
								className="text-xs text-purple-400 hover:text-purple-300 transition-colors duration-200 font-medium 
  disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{loadingMore ? "Loading..." : "Load more notifications"}
							</button>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
