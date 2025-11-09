import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

export default function DeleteAccountModal({ isOpen, onClose, onConfirm }) {
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isDeleting, setIsDeleting] = useState(false);

	if (!isOpen) return null;

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (!password) {
			setError("Password is required");
			return;
		}

		setIsDeleting(true);
		try {
			await onConfirm(password);
		} catch (err) {
			setError(err.message || "Failed to delete account");
			setIsDeleting(false);
		}
	};

	const handleClose = () => {
		if (!isDeleting) {
			setPassword("");
			setError("");
			onClose();
		}
	};

	return (
		<>
			{/* Backdrop */}
			<div
				className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
				onClick={handleClose}
			></div>

			{/* Modal */}
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
				<div
					className="relative w-full max-w-md rounded-xl border border-red-900/50 bg-gray-900 shadow-2xl"
					onClick={(e) => e.stopPropagation()}
				>
					{/* Close button */}
					<button
						onClick={handleClose}
						disabled={isDeleting}
						className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-800 hover:text-white disabled:opacity-50"
					>
						<X className="h-5 w-5" />
					</button>

					{/* Header */}
					<div className="border-b border-gray-800 p-6">
						<div className="flex items-center gap-3">
							<div className="rounded-full bg-red-900/20 p-2">
								<AlertTriangle className="h-6 w-6 text-red-500" />
							</div>
							<div>
								<h2 className="text-xl font-bold text-white">
									Delete Account
								</h2>
								<p className="text-sm text-gray-400">
									This action cannot be undone
								</p>
							</div>
						</div>
					</div>

					{/* Content */}
					<form onSubmit={handleSubmit} className="p-6 space-y-4">
						<div className="rounded-lg bg-red-900/10 border border-red-900/30 p-4">
							<p className="text-sm text-gray-300">
								Are you absolutely sure you want to delete your account? This will:
							</p>
							<ul className="mt-2 space-y-1 text-sm text-gray-400">
								<li className="flex items-start gap-2">
									<span className="text-red-500">•</span>
									<span>Permanently delete your account</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-red-500">•</span>
									<span>Remove all your personal data</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-red-500">•</span>
									<span>Your posts and comments will show as "Deleted User"</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-red-500">•</span>
									<span>This action cannot be reversed</span>
								</li>
							</ul>
						</div>

						<div className="space-y-2">
							<label
								htmlFor="password"
								className="text-sm font-medium text-gray-300"
							>
								Enter your password to confirm
							</label>
							<input
								type="password"
								id="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
								placeholder="Enter your password"
								disabled={isDeleting}
								autoFocus
							/>
							{error && (
								<p className="text-sm text-red-400">{error}</p>
							)}
						</div>

						{/* Actions */}
						<div className="flex gap-3 pt-2">
							<button
								type="button"
								onClick={handleClose}
								disabled={isDeleting}
								className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 font-medium text-white hover:bg-gray-700 disabled:opacity-50"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={isDeleting || !password}
								className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white hover:bg-red-700 disabled:opacity-50"
							>
								{isDeleting ? "Deleting..." : "Delete Account"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}
