import { Clock, Image, XCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "../../context/ToastContext";
import Card from "./Card";
import ProfileAvatar from "./ProfileAvatar";

export default function PostForm({
	user,
	initialContent = "",
	initialMedia = [],
	isEditing = false,
	onSubmit,
	isSubmitting = false,
}) {
	const { showError, showInfo } = useToast();
	const [content, setContent] = useState(initialContent);
	const [expirationTime, setExpirationTime] = useState("24");
	const [mediaItems, setMediaItems] = useState([]);

	const activeUrlsRef = useRef([]);

	useEffect(() => {
		setContent(initialContent);
		const initialExistingMedia = Array.isArray(initialMedia)
			? initialMedia
					.filter((item) => {
						return item && (item.url || item._id);
					})
					.map((item) => {
						let mediaType = item.type;
						if (!mediaType && item.url) {
							mediaType = determineMediaTypeFromUrl(item.url);
						}

						return {
							id: item._id || item.id,
							url: item.url,
							type: mediaType,
							isExisting: true,
							publicId: item.publicId,
						};
					})
			: [];
		setMediaItems(initialExistingMedia);
	}, [initialContent, initialMedia]);

	const determineMediaTypeFromUrl = (url) => {
		if (!url) return "unknown";
		if (url.match(/\.(jpeg|jpg|gif|png|webp)$/i)) return "image";
		if (url.match(/\.(mp4|webm|ogg)$/i)) return "video";
		return "unknown";
	};

	// Manage object URLs lifecycle to prevent memory leaks
	useEffect(() => {
		// Revoke previous object URLs that are no longer in use
		const currentUrls = mediaItems
			.filter((item) => !item.isExisting && item.previewUrl)
			.map((item) => item.previewUrl);

		// Revoke URLs that are no longer in the current media items
		activeUrlsRef.current.forEach((url) => {
			if (!currentUrls.includes(url)) {
				URL.revokeObjectURL(url);
			}
		});

		// Update the ref with current URLs
		activeUrlsRef.current = currentUrls;

		// Cleanup: revoke all remaining URLs on component unmount
		return () => {
			activeUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
		};
	}, [mediaItems]);

	const handleFileChange = (e) => {
		const selectedFiles = Array.from(e.target.files);

		for (const file of selectedFiles) {
			if (!(file.type.startsWith("image/") || file.type.startsWith("video/"))) {
				showError("Only images and videos are allowed.");
				e.target.value = null;
				return;
			}
			if (file.size > 200 * 1024 * 1024) {
				showError("Each file must be less than 200MB.");
				e.target.value = null;
				return;
			}
		}
		if (mediaItems.length + selectedFiles.length > 5) {
			showError("You can add a maximum of 5 media items per post.");
			e.target.value = null;
			return;
		}

		const newMedia = selectedFiles.map((file) => ({
			file: file,
			previewUrl: URL.createObjectURL(file),
			type: file.type,
			isExisting: false,
			tempId: Date.now() + Math.random(),
		}));

		setMediaItems((prevMedia) => [...prevMedia, ...newMedia]);
		e.target.value = null;
	};

	const removeMedia = useCallback(
		(itemToRemove) => {
			setMediaItems((prevMediaItems) => {
				const newMediaItems = prevMediaItems.filter(
					(item) => item !== itemToRemove
				);
				return newMediaItems;
			});
			showInfo("Media removed");
		},
		[showInfo]
	);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!content.trim()) {
			showInfo("Content cannot be empty.");
			return;
		}
		const formData = new FormData();
		formData.append("content", content);
		formData.append("expirationTime", expirationTime);
		const existingMediaIdsToKeep = mediaItems
			.filter((item) => item.isExisting)
			.map((item) => item.id || item._id)
			.filter(Boolean);
		mediaItems.forEach((item) => {
			if (!item.isExisting && item.file) {
				formData.append("media", item.file);
			}
		});
		if (isEditing) {
			if (existingMediaIdsToKeep.length > 0) {
				existingMediaIdsToKeep.forEach((id) => {
					formData.append("existingMediaIds", id);
				});
			} else {
				formData.append("existingMediaIds", "");
			}
		}

		try {
			await onSubmit(formData);
			if (!isEditing) {
				setContent("");
				setMediaItems([]);
				setExpirationTime("24");
			}
		} catch (error) {
			showError(error.message || "Failed to create post. Please try again.");
		}
	};

	// Helper functions for media type checking
	const isImage = (type) => {
		return (
			type === "image" ||
			type === "image/jpeg" ||
			type === "image/png" ||
			type === "image/gif" ||
			type.startsWith("image/")
		);
	};

	const isVideo = (type) => {
		return (
			type === "video" ||
			type === "video/mp4" ||
			type === "video/webm" ||
			type === "video/ogg" ||
			type.startsWith("video/")
		);
	};

	return (
		<Card className="mb-4 sm:mb-6 p-3 sm:p-4 lg:p-5">
			<form onSubmit={handleSubmit}>
				<div className="flex gap-2 sm:gap-3">
					<div className="flex-shrink-0">
						<ProfileAvatar user={user} size="sm" />
					</div>

					<div className="flex-1 min-w-0">
						<textarea
							className="min-h-[80px] sm:min-h-[100px] w-full resize-none rounded-lg border border-gray-800/80 bg-gray-900/50 p-2.5 sm:p-3 text-sm sm:text-base text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors duration-200"
							placeholder={`What's on your mind? It'll disappear in ${
								expirationTime || 24
							} hours..`}
							value={content}
							onChange={(e) => setContent(e.target.value)}
						/>

						{mediaItems.length > 0 && (
							<div className="mt-2 sm:mt-3 flex flex-wrap gap-2">
								{mediaItems.map((item, idx) => {
									const url = item.isExisting ? item.url : item.previewUrl;

									if (!url) return null;

									return (
										<div
											key={item.id || item.tempId || idx}
											className="relative group h-20 w-20 sm:h-24 sm:w-24 rounded-md overflow-hidden shadow-md"
										>
											{isImage(item.type) ? (
												<img
													src={url}
													alt={
														item.isExisting
															? "Existing media"
															: `Preview of ${item.file.name}`
													}
													className="h-full w-full object-cover"
												/>
											) : isVideo(item.type) ? (
												<video
													src={url}
													controls
													className="h-full w-full object-cover"
												/>
											) : (
												<div className="h-full w-full bg-gray-800 text-white flex items-center justify-center text-center text-xs p-1">
													Cannot preview{" "}
													{item.isExisting
														? `Media (${item.id})`
														: item.file.name}
												</div>
											)}
											<button
												type="button"
												onClick={() => removeMedia(item)}
												className="absolute top-1 right-1 rounded-full bg-gray-900/90 text-white hover:bg-gray-900 p-1.5 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 touch-manipulation"
												aria-label="Remove media"
											>
												<XCircle className="h-4 w-4" aria-hidden="true" />
											</button>
										</div>
									);
								})}
								{mediaItems.length > 0 && (
									<p className="w-full mt-1 text-xs text-gray-400">
										{mediaItems.length} media item(s) selected{" "}
										{mediaItems.length >= 5 && "(Maximum reached)"}
									</p>
								)}
							</div>
						)}

						<div className="mt-2 sm:mt-3 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-3">
							<div className="flex gap-1">
								<label className="cursor-pointer rounded-full p-2 hover:bg-gray-800/70 transition-colors duration-200 touch-manipulation">
									<input
										type="file"
										accept="image/*,video/*"
										className="hidden"
										onChange={handleFileChange}
										multiple
										aria-label="Add images or videos"
									/>
									<Image
										className="h-5 w-5 text-purple-400"
										aria-hidden="true"
									/>
									<span className="sr-only">Add media</span>
								</label>
							</div>

							<div className="flex items-center gap-2 sm:gap-3 w-full xs:w-auto">
								<div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm flex-1 xs:flex-initial">
									<Clock className="h-4 w-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
									<span className="text-gray-400 hidden sm:inline">Duration:</span>
									<select
										value={expirationTime}
										onChange={(e) => setExpirationTime(e.target.value)}
										className="rounded border border-gray-800/80 bg-gray-900/50 px-1.5 sm:px-2 py-1 sm:py-1.5 text-xs sm:text-sm text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 min-w-0 flex-1 xs:flex-initial"
										aria-label="Post duration"
									>
										<option value="12">12h</option>
										<option value="24">24h</option>
										<option value="48">48h</option>
										<option value="72">3d</option>
										<option value="168">7d</option>
									</select>
								</div>

								<button
									type="submit"
									disabled={isSubmitting}
									className="rounded-md bg-gradient-to-r from-purple-600 to-blue-600 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-70 touch-manipulation whitespace-nowrap"
								>
									{isSubmitting ? "Posting..." : isEditing ? "Update" : "Post"}
								</button>
							</div>
						</div>
					</div>
				</div>
			</form>
		</Card>
	);
}
