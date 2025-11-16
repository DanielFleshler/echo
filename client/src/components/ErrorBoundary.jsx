import React from "react";

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		// Log error to error reporting service in production
		if (import.meta.env.PROD) {
			// Add error reporting service here (e.g., Sentry)
			console.error("ErrorBoundary caught an error:", error, errorInfo);
		}
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="flex min-h-screen items-center justify-center bg-gray-950">
					<div className="text-center p-8 bg-gray-900 rounded-xl border border-gray-800 max-w-md">
						<h1 className="text-2xl font-bold text-white mb-4">
							Something went wrong
						</h1>
						<p className="text-gray-400 mb-6">
							We're sorry for the inconvenience. Please try refreshing the page.
						</p>
						<button
							onClick={() => window.location.reload()}
							className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
						>
							Refresh Page
						</button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
