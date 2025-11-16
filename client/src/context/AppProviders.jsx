import { AuthProvider } from "./AuthContext";
import { ChatProvider } from "./ChatContext";
import { FollowerProvider } from "./FollowerContext";
import { PostProvider } from "./PostContext";
import { ToastProvider } from "./ToastContext";
import { ViewTrackingProvider } from "./ViewTrackingContext";

export const AppProviders = ({ children }) => {
	return (
		<ToastProvider>
			<AuthProvider>
				<ChatProvider>
					<ViewTrackingProvider>
						<FollowerProvider>
							<PostProvider>{children}</PostProvider>
						</FollowerProvider>
					</ViewTrackingProvider>
				</ChatProvider>
			</AuthProvider>
		</ToastProvider>
	);
};
