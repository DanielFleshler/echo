import React from "react";

export default function ProfileTabs({ activeTab, setActiveTab }) {
	return (
		<div className="mt-3 sm:mt-4 flex gap-4 sm:gap-8">
			<button
				onClick={() => setActiveTab("posts")}
				className={`border-b-2 pb-2 text-sm sm:text-base font-medium transition-colors touch-manipulation ${
					activeTab === "posts"
						? "border-purple-600 text-purple-600"
						: "border-transparent text-gray-400 hover:text-white"
				}`}
			>
				Posts
			</button>
			<button
				onClick={() => setActiveTab("media")}
				className={`border-b-2 pb-2 text-sm sm:text-base font-medium transition-colors touch-manipulation ${
					activeTab === "media"
						? "border-purple-600 text-purple-600"
						: "border-transparent text-gray-400 hover:text-white"
				}`}
			>
				Media
			</button>
		</div>
	);
}
