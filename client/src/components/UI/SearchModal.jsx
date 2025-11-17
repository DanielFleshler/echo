import { Search, Sparkles, User, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api.js";

export default function SearchModal({ isOpen, onClose, anchorRect }) {
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [searching, setSearching] = useState(false);
	const modalRef = useRef(null);
	const inputRef = useRef(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (searchQuery.length < 2) {
			setSearchResults([]);
			setSearching(false);
			return;
		}
		setSearching(true);

		const timer = setTimeout(async () => {
			try {
				const response = await api.get(`/users/search?q=${searchQuery}`);
				const users = response.data.data.users;
				setSearchResults(users);
			} catch (error) {
				console.error("Search error:", error);
				setSearchResults([]);
			} finally {
				setSearching(false);
			}
		}, 300);
		return () => clearTimeout(timer);
	}, [searchQuery]);

	// Focus the search input when the modal opens
	useEffect(() => {
		if (isOpen && inputRef.current) {
			setTimeout(() => {
				inputRef.current.focus();
			}, 100);
		}
	}, [isOpen]);

	// Close the modal when clicking outside
	useEffect(() => {
		function handleClickOutside(event) {
			if (modalRef.current && !modalRef.current.contains(event.target)) {
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

	// Close on escape key
	useEffect(() => {
		const handleEsc = (event) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEsc);
		}
		return () => {
			document.removeEventListener("keydown", handleEsc);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const style = anchorRect
		? {
				position: "fixed",
				top: `${anchorRect.bottom + 8}px`,
				left: "50%",
				transform: "translateX(-50%)",
				zIndex: 100,
				maxWidth: "500px",
				width: window.innerWidth < 640 ? "calc(100vw - 1rem)" : "90%",
		  }
		: {};

	return (
		<>
			<div
				className="fixed inset-0 z-40 bg-transparent"
				onClick={onClose}
			></div>
			<div
				ref={modalRef}
				className="rounded-lg sm:rounded-xl border border-gray-800/50 bg-gray-900/95 backdrop-blur-sm shadow-xl transform
  transition-all duration-200 ease-out z-50"
				style={{
					...style,
					boxShadow: "0 10px 25px rgba(0, 0, 0, 0.4)",
				}}
				role="dialog"
				aria-label="Search users"
			>
				{/* Small decorative arrow pointing up to navbar */}
				<div
					className="absolute w-4 h-4 bg-gray-900/90 backdrop-blur-sm border-t border-l border-gray-800/50 transform 
  rotate-45 -translate-y-2"
					style={{
						top: "0",
						left: "50%",
						marginLeft: "-8px",
					}}
				></div>

				<div className="p-3 sm:p-5">
					{/* Search Input */}
					<div className="mb-3 sm:mb-4">
						<div className="relative w-full">
							<input
								ref={inputRef}
								type="text"
								placeholder="Search for users..."
								className="w-full rounded-lg border border-gray-800/80 bg-gray-900/50 pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base text-white
  placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500
  transition-colors duration-200"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								aria-label="Search for users"
							/>
							<Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" aria-hidden="true" />
						</div>
					</div>

					{/* Search Results */}
					<div
						className="max-h-60 sm:max-h-80 overflow-y-auto hide-scrollbar"
						style={{
							minHeight: searchQuery ? "100px" : "0"
						}}
					>
						{!searchQuery ? (
							<div className="text-center py-6 sm:py-8">
								<Search className="mx-auto h-5 w-5 sm:h-6 sm:w-6 text-gray-400" aria-hidden="true" />
								<p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-400">
									Type to search for users...
								</p>
							</div>
						) : searching ? (
							<div className="text-center py-6 sm:py-8">
								<Sparkles className="mx-auto h-5 w-5 sm:h-6 sm:w-6 animate-pulse text-purple-500" aria-hidden="true" />
								<p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-300">Searching...</p>
							</div>
						) : searchResults.length === 0 ? (
							<div className="rounded-lg bg-gray-900/50 border border-gray-800/50 p-3 sm:p-5 text-center shadow-md">
								<div
									className="mx-auto mb-2 sm:mb-3 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-2 sm:p-3
  flex items-center justify-center"
								>
									<Users className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" aria-hidden="true" />
								</div>
								<h3 className="text-xs sm:text-sm font-medium text-white">
									No results found
								</h3>
								<p className="mt-1 sm:mt-2 text-xs text-gray-400">
									No matches for "{searchQuery}"
								</p>
							</div>
						) : (
							<div className="space-y-2 sm:space-y-3">
								{searchResults.map((user) => (
									<button
										key={user._id}
										className="w-full p-2 sm:p-3 flex items-center gap-2 sm:gap-3 rounded-lg border border-gray-800/50 bg-gray-900/40
  hover:bg-gray-800/30 transition-colors duration-200 cursor-pointer touch-manipulation text-left"
										onClick={() => {
											navigate(`/profile/${user._id}`);
											onClose();
										}}
										aria-label={`View ${user.fullName}'s profile`}
									>
										<div
											className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-purple-700/30 to-blue-700/30 flex items-center
   justify-center shadow-md overflow-hidden flex-shrink-0"
										>
											{user.profilePicture ? (
												<img
													src={user.profilePicture}
													alt={user.username}
													className="w-full h-full object-cover"
												/>
											) : (
												<User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300" aria-hidden="true" />
											)}
										</div>
										<div className="min-w-0 flex-1">
											<h4 className="font-medium text-white text-sm sm:text-base truncate">
												{user.fullName}
											</h4>
											<p className="text-xs text-gray-400 truncate">@{user.username}</p>
										</div>
									</button>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
