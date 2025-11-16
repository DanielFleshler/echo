import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AppProviders } from "./context/AppProviders";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import OTPVerificationPage from "./pages/OTPVerificationPage";
import ProfilePage from "./pages/ProfilePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import RoomChatPage from "./pages/RoomChatPage";
import RoomsPage from "./pages/RoomsPage";
import SettingsPage from "./pages/SettingsPage";
import SignupPage from "./pages/SignupPage";
import SuccessPage from "./pages/SuccessPage";
import MessagesPage from "./pages/MessagesPage";

function App() {
	return (
		<Router>
			<AppProviders>
				<Routes>
					{/* Protected routes */}
					<Route
						path="/"
						element={
							<ProtectedRoute>
								<Layout>
									<HomePage />
								</Layout>
							</ProtectedRoute>
						}
					/>
					<Route
						path="/profile"
						element={
							<ProtectedRoute>
								<Layout>
									<ProfilePage />
								</Layout>
							</ProtectedRoute>
						}
					/>
					<Route
						path="/profile/:userId"
						element={
							<ProtectedRoute>
								<Layout>
									<ProfilePage />
								</Layout>
							</ProtectedRoute>
						}
					/>
					<Route
						path="/settings"
						element={
							<ProtectedRoute>
								<Layout>
									<SettingsPage />
								</Layout>
							</ProtectedRoute>
						}
					/>
					<Route
						path="/rooms"
						element={
							<ProtectedRoute>
								<Layout>
									<RoomsPage />
								</Layout>
							</ProtectedRoute>
						}
					/>
					<Route
						path="/rooms/:roomId"
						element={
							<ProtectedRoute>
								<Layout showHeader={false}>
									<RoomChatPage />
								</Layout>
							</ProtectedRoute>
						}
					/>
					<Route
						path="/messages"
						element={
							<ProtectedRoute>
								<Layout>
									<MessagesPage />
								</Layout>
							</ProtectedRoute>
						}
					/>
					<Route
						path="/messages/:conversationId"
						element={
							<ProtectedRoute>
								<Layout>
									<MessagesPage />
								</Layout>
							</ProtectedRoute>
						}
					/>
					{/* Public routes */}
					<Route
						path="/login"
						element={
							<Layout showHeader={false}>
								<LoginPage />
							</Layout>
						}
					/>
					<Route
						path="/signup"
						element={
							<Layout showHeader={false}>
								<SignupPage />
							</Layout>
						}
					/>
					<Route
						path="/verify-email/:userId"
						element={
							<Layout showHeader={false}>
								<OTPVerificationPage />
							</Layout>
						}
					/>
					<Route
						path="/forgot-password"
						element={
							<Layout showHeader={false}>
								<ForgotPasswordPage />
							</Layout>
						}
					/>
					<Route
						path="/reset-password/:token"
						element={
							<Layout showHeader={false}>
								<ResetPasswordPage />
							</Layout>
						}
					/>
					<Route
						path="/success"
						element={
							<Layout showHeader={false}>
								<SuccessPage />
							</Layout>
						}
					/>
					{/* 404 - Not Found Page (catch all) */}
					<Route
						path="*"
						element={
							<Layout showHeader={false}>
								<NotFoundPage />
							</Layout>
						}
					/>
				</Routes>
			</AppProviders>
		</Router>
	);
}

export default App;
