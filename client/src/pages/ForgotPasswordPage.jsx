import { ArrowLeft, Mail, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useForm } from "../hooks/useForm";

export default function ForgotPasswordPage() {
	const { forgotPassword, loading: authLoading } = useAuth();
	const { showSuccess, showError } = useToast();
	const [submitted, setSubmitted] = useState(false);
	const [submittedEmail, setSubmittedEmail] = useState("");

	const form = useForm({
		initialValues: { email: "" },
		validate: (values) => {
			const errors = {};
			if (!values.email) {
				errors.email = "Email is required";
			} else if (
				!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
			) {
				errors.email = "Invalid email address";
			}
			return errors;
		},
		onSubmit: async (values) => {
			try {
				await forgotPassword(values.email);
				showSuccess("Reset link sent! Check your email for instructions.");
				setSubmittedEmail(values.email);
				setSubmitted(true);
			} catch (err) {
				const errorMessage =
					err.message || "Failed to send reset email. Please try again.";
				showError(errorMessage);
				throw err;
			}
		},
	});

	if (authLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-950">
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<div className="flex min-h-screen flex-col bg-gray-950">
			<div className="flex flex-1 items-center justify-center p-10">
				<div className="w-full max-w-md space-y-8">
					<div className="space-y-2 text-center">
						<div className="flex justify-center">
							<div className="flex items-center gap-2">
								<Sparkles className="h-8 w-8 text-purple-500" />
								<span className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
									Echo
								</span>
							</div>
						</div>
						<h1 className="text-3xl font-bold text-white">Forgot password</h1>
						<p className="text-gray-400">
							Enter your email to receive a password reset link
						</p>
					</div>

					{form.submitError && (
						<div className="rounded-md bg-red-900/30 p-3 border border-red-900">
							<p className="text-sm text-red-400">{form.submitError}</p>
						</div>
					)}

					{submitted ? (
						<div className="space-y-4">
							<div className="rounded-lg bg-green-900/30 p-4 border border-green-900">
								<p className="text-sm text-green-400">
									Reset link sent! Check your email at{" "}
									<span className="font-semibold">{submittedEmail}</span> for
									instructions to reset your password.
								</p>
							</div>
							<Link
								to="/login"
								className="block w-full rounded-md bg-gradient-to-r from-purple-600 to-blue-600 py-2 text-center text-sm font-medium text-white hover:from-purple-700 hover:to-blue-700"
							>
								Return to Login
							</Link>
						</div>
					) : (
						<form onSubmit={form.handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<label
									htmlFor="email"
									className="block text-sm font-medium text-gray-300"
								>
									Email address
								</label>
								<div className="relative">
									<input
										id="email"
										name="email"
										placeholder="hello@example.com"
										type="email"
										value={form.values.email}
										onChange={form.handleChange}
										className={`w-full rounded-md border ${
											form.errors.email ? "border-red-500" : "border-gray-800"
										} bg-gray-900 pl-10 pr-3 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500`}
									/>
									<Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
								</div>
								{form.errors.email && (
									<p className="text-xs text-red-400 mt-1">
										{form.errors.email}
									</p>
								)}
							</div>

							<button
								type="submit"
								disabled={form.isSubmitting}
								className="w-full rounded-md bg-gradient-to-r from-purple-600 to-blue-600 py-2.5 text-sm font-medium text-white hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{form.isSubmitting ? "Sending..." : "Send Reset Link"}
							</button>
						</form>
					)}

					<div className="text-center">
						<Link
							to="/login"
							className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300"
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to login
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
