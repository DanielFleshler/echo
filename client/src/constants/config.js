// API Configuration
export const API_CONFIG = {
	BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
	SOCKET_URL: (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/api\/v\d+$/, ''),
};

// Socket Configuration
export const SOCKET_CONFIG = {
	AUTO_CONNECT: true,
	RECONNECTION: true,
	RECONNECTION_DELAY: 1000,
	RECONNECTION_ATTEMPTS: 5,
	WITH_CREDENTIALS: true,
	TRANSPORTS: ['websocket', 'polling'],
	CONNECTION_TIMEOUT: 10000, // 10 seconds
};

// Pagination Configuration
export const PAGINATION = {
	DEFAULT_PAGE_SIZE: 15,
	INITIAL_PAGE: 1,
};

// Chat Configuration
export const CHAT_CONFIG = {
	MAX_MESSAGE_LENGTH: 2000,
	CHAR_COUNT_THRESHOLD: 0.8, // Show character count when 80% of limit is reached
};

// Post Configuration
export const POST_CONFIG = {
	DEFAULT_HOURS: 24,
	MAX_CONTENT_LENGTH: 500,
};

// Environment
export const IS_PRODUCTION = import.meta.env.PROD;
export const IS_DEVELOPMENT = import.meta.env.DEV;
