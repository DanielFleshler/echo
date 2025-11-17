import {
	Calendar,
	Camera,
	Edit,
	Mail,
	MapPin,
	UserMinus,
	UserPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFollower } from "../../context/FollowerContext";
import { useToast } from "../../context/ToastContext";
import { useChat } from "../../context/ChatContext";
import ProfileAvatar from "../UI/ProfileAvatar";

export default function ProfileContent({ profileData, isOwnProfile }) {
	const { getFollowerStats, toggleFollow } = useFollower();
	const { showError } = useToast();
	const { openChat } = useChat();
	const [followStats, setFollowStats] = useState({ isFollowing: false });
	const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);
	const [isCreatingConversation, setIsCreatingConversation] = useState(false);

	useEffect(() => {
		const loadFollowStats = async () => {
			if (profileData && profileData._id && !isOwnProfile) {
				try {
					const stats = await getFollowerStats(profileData._id);
					if (stats) {
						setFollowStats(stats);
					}
				} catch (error) {
					// Error is already handled by the context
				}
			}
		};

		loadFollowStats();
	}, [profileData, isOwnProfile, getFollowerStats]);

	const handleFollowToggle = async () => {
		if (isUpdatingFollow || !profileData || !profileData._id) return;

		try {
			setIsUpdatingFollow(true);
			const success = await toggleFollow(
				profileData._id,
				followStats.isFollowing
			);

			if (success) {
				setFollowStats((prev) => ({
					...prev,
					isFollowing: !prev.isFollowing,
				}));
			}
		} catch (error) {
			showError("Failed to update follow status");
		} finally {
			setIsUpdatingFollow(false);
		}
	};

	const handleMessageClick = async () => {
		if (isCreatingConversation || !profileData || !profileData._id) return;

		try {
			setIsCreatingConversation(true);
			await openChat(profileData._id);
		} catch (error) {
			showError("Failed to open chat");
		} finally {
			setIsCreatingConversation(false);
		}
	};

	return (
		<div>
			{/* Cover Image */}
			<div className="h-40 sm:h-60 w-full bg-gradient-to-r from-purple-900 to-blue-900" />

			{/* Profile Image and Basic Info */}
			<div className="container px-3 sm:px-4">
				<div className="relative -mt-16 sm:-mt-20">
					{/* Avatar */}
					<div className="relative inline-block">
						<ProfileAvatar
							user={profileData}
							size="3xl"
							className="border-4 border-gray-950"
						/>
						{isOwnProfile && (
							<Link
								to="/settings"
								className="absolute bottom-0 right-0 rounded-full bg-purple-600 p-2 text-white shadow-lg hover:bg-purple-700 touch-manipulation"
							>
								<Camera className="h-4 w-4" />
								<span className="sr-only">Change profile picture</span>
							</Link>
						)}
					</div>

					{/* Action Button - Desktop Only (Top Right) */}
					<div className="hidden sm:block absolute top-4 right-0">
						{isOwnProfile ? (
							<Link
								to="/settings"
								className="flex items-center gap-2 rounded-full bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
							>
								<Edit className="h-4 w-4" />
								<span>Edit Profile</span>
							</Link>
						) : (
							<div className="flex gap-2">
								<button
									onClick={handleFollowToggle}
									disabled={isUpdatingFollow}
									className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
										followStats.isFollowing
											? "bg-gray-700 text-white hover:bg-gray-600"
											: "bg-purple-600 text-white hover:bg-purple-700"
									} ${isUpdatingFollow ? "opacity-70" : ""}`}
								>
									{isUpdatingFollow ? (
										"Processing..."
									) : followStats.isFollowing ? (
										<>
											<UserMinus className="h-4 w-4" />
											<span>Unfollow</span>
										</>
									) : (
										<>
											<UserPlus className="h-4 w-4" />
											<span>Follow</span>
										</>
									)}
								</button>
								<button
									onClick={handleMessageClick}
									disabled={isCreatingConversation}
									className={`flex items-center gap-2 rounded-full bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors ${isCreatingConversation ? "opacity-70" : ""}`}
								>
									<Mail className="h-4 w-4" />
									<span>{isCreatingConversation ? "Loading..." : "Message"}</span>
								</button>
							</div>
						)}
					</div>

					{/* Name and Username */}
					<div className="mt-3 sm:mt-4">
						<h2 className="text-xl sm:text-2xl font-bold text-white">
							{profileData.fullName}
						</h2>
						<p className="text-sm sm:text-base text-gray-400">
							@{profileData.username || "username"}
						</p>
					</div>

					{/* Action Buttons - Mobile Only (Below Name) */}
					<div className="mt-3 sm:hidden">
						{isOwnProfile ? (
							<Link
								to="/settings"
								className="flex items-center justify-center gap-2 w-full rounded-full bg-gray-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors touch-manipulation"
							>
								<Edit className="h-4 w-4" />
								<span>Edit Profile</span>
							</Link>
						) : (
							<div className="flex gap-2">
								<button
									onClick={handleFollowToggle}
									disabled={isUpdatingFollow}
									className={`flex-1 flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors touch-manipulation ${
										followStats.isFollowing
											? "bg-gray-700 text-white hover:bg-gray-600"
											: "bg-purple-600 text-white hover:bg-purple-700"
									} ${isUpdatingFollow ? "opacity-70" : ""}`}
								>
									{isUpdatingFollow ? (
										"Processing..."
									) : followStats.isFollowing ? (
										<>
											<UserMinus className="h-4 w-4" />
											<span>Unfollow</span>
										</>
									) : (
										<>
											<UserPlus className="h-4 w-4" />
											<span>Follow</span>
										</>
									)}
								</button>
								<button
									onClick={handleMessageClick}
									disabled={isCreatingConversation}
									className={`flex-1 flex items-center justify-center gap-2 rounded-full bg-gray-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors touch-manipulation ${isCreatingConversation ? "opacity-70" : ""}`}
								>
									<Mail className="h-4 w-4" />
									<span>{isCreatingConversation ? "Loading..." : "Message"}</span>
								</button>
							</div>
						)}
					</div>
				</div>

				{/* Profile Bio */}
				<div className="mt-4 sm:mt-6 max-w-2xl">
					<p className="text-sm sm:text-base text-gray-300">{profileData.bio || "No bio yet."}</p>
					<div className="mt-3 sm:mt-4 flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
						{profileData.location && (
							<div className="flex items-center gap-1">
								<MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
								<span>{profileData.location}</span>
							</div>
						)}
						<div className="flex items-center gap-1">
							<Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
							<span>
								Joined {new Date(profileData.createdAt).toLocaleDateString()}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
