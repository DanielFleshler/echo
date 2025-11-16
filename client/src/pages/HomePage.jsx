import { Sparkles } from "lucide-react";
import MessageSidebar from "../components/UI/MessageSidebar";
import PostFeed from "../components/UI/PostFeed";
import TrendingSidebar from "../components/UI/TrendingSidebar";
import ChatModal from "../components/UI/ChatModal";
import { useAuth } from "../context/AuthContext";
import { usePost } from "../context/PostContext";
import { useChat } from "../context/ChatContext";
import LoadingSpinner from "../components/UI/LoadingSpinner";

export default function HomePage() {
	const { user, loading: authLoading } = useAuth();
	const {
		posts,
		trendingPosts,
		loadingPosts,
		loadingTrending,
		loadMorePosts,
		hasMore,
		createPost,
		getHoursLeft,
	} = usePost();
	const { isChatModalOpen, closeChat } = useChat();

	if (authLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-950">
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<div className="flex flex-col">
			<main className="flex-1 py-8">
				<div className="container grid grid-cols-4 gap-8 px-4">
					{/* Message Sidebar */}
					<MessageSidebar />

					{/* Post Feed */}
					<PostFeed
						user={user}
						posts={posts}
						loadingPosts={loadingPosts}
						hasMore={hasMore}
						loadMorePosts={loadMorePosts}
						createPost={createPost}
					/>

					{/* Trending Sidebar */}
					<TrendingSidebar
						trendingPosts={trendingPosts}
						loadingTrending={loadingTrending}
						getHoursLeft={getHoursLeft}
					/>
				</div>
			</main>

			{/* Chat Modal */}
			<ChatModal isOpen={isChatModalOpen} onClose={closeChat} />
		</div>
	);
}
