import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
});

api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		const isAuthEndpoint =
			originalRequest.url?.includes("/users/login") ||
			originalRequest.url?.includes("/users/signup") ||
			originalRequest.url?.includes("/users/verify-otp") ||
			originalRequest.url?.includes("/users/forgot-password") ||
			originalRequest.url?.includes("/users/reset-password") ||
			originalRequest.url?.includes("/users/refresh-token");
		if (
			error.response?.status === 401 &&
			!originalRequest._retry &&
			!isAuthEndpoint
		) {
			originalRequest._retry = true;

			try {
				// Get refresh token from localStorage
				const refreshToken = localStorage.getItem("refreshToken");

				if (!refreshToken) {
					// No refresh token available, redirect to login
					localStorage.removeItem("token");
					localStorage.removeItem("refreshToken");
					localStorage.removeItem("user");
					window.location.href = "/login?session=expired";
					return Promise.reject(error);
				}

				// Attempt to refresh the token
				const response = await axios.post(
					`${API_URL}/users/refresh-token`,
					{ refreshToken },
					{ withCredentials: true }
				);

				// Save new tokens (tokens are at root level of response.data)
				const { token, refreshToken: newRefreshToken } = response.data;
				localStorage.setItem("token", token);
				localStorage.setItem("refreshToken", newRefreshToken);

				// Update the authorization header for the original request
				originalRequest.headers["Authorization"] = `Bearer ${token}`;

				// Retry the original request with new token
				return api(originalRequest);
			} catch (refreshError) {
				// Refresh failed, clear storage and redirect to login
				localStorage.removeItem("token");
				localStorage.removeItem("refreshToken");
				localStorage.removeItem("user");
				window.location.href = "/login?session=expired";
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);

export default api;
