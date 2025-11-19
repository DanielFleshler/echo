export default function ProfileAvatar({
	user = {},
	size = "md",
	className = "",
	profilePicture,
	username,
	fullName,
}) {
	// Normalize numeric sizes to Tailwind class names
	const normalizeSize = (s) => {
		const numericSizeMap = {
			"4": "2xs",  // h-4 w-4
			"6": "2xs",  // h-6 w-6
			"8": "xs",   // h-8 w-8
			"10": "sm",  // h-10 w-10
			"12": "md",  // h-12 w-12
			"16": "lg",  // h-16 w-16
			"24": "xl",  // h-24 w-24
			"32": "2xl", // h-32 w-32
			"40": "3xl", // h-40 w-40
		};
		return numericSizeMap[s] || s;
	};

	const normalizedSize = normalizeSize(size);

	// Define size classes
	const sizeClasses = {
		"2xs": "h-6 w-6",
		xs: "h-8 w-8",
		sm: "h-10 w-10",
		md: "h-12 w-12",
		lg: "h-16 w-16",
		xl: "h-24 w-24",
		"2xl": "h-32 w-32",
		"3xl": "h-40 w-40",
	};

	// Define text size classes for fallback initials
	const textSizeClasses = {
		"2xs": "text-[10px]",
		xs: "text-xs",
		sm: "text-sm",
		md: "text-md",
		lg: "text-xl",
		xl: "text-3xl",
		"2xl": "text-4xl",
		"3xl": "text-5xl",
	};

	// Allow passing user object OR individual props
	const userObj = user || {};
	const finalProfilePicture = profilePicture || userObj.profilePicture;
	const finalUsername = username || userObj.username;
	const finalFullName = fullName || userObj.fullName;

	// Get user's initials for fallback
	const getInitials = () => {
		if (finalFullName) {
			return finalFullName.charAt(0).toUpperCase();
		}
		if (finalUsername) {
			return finalUsername.charAt(0).toUpperCase();
		}
		return "U";
	};

	return (
		<div
			className={`overflow-hidden rounded-full border border-purple-900/20 ${sizeClasses[normalizedSize]} ${className} shadow-md shadow-purple-900/10 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-900/15`}
		>
			{finalProfilePicture ? (
				<img
					src={finalProfilePicture}
					alt={finalFullName || finalUsername || "User"}
					className="h-full w-full object-cover"
				/>
			) : (
				<div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-700 to-blue-700">
					<span className={`font-bold text-white ${textSizeClasses[normalizedSize]}`}>
						{getInitials()}
					</span>
				</div>
			)}
		</div>
	);
}
