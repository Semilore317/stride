import axios from "axios"

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:9090/api/v1",
    withCredentials: true,  // for authenticated requests (cookies for refresh token)
})

// Request interceptor to add JWT token and fix leading slashes
api.interceptors.request.use(
    (config) => {
        // Fix: If URL starts with /, Axios treats it as root of domain and ignores baseURL's path.
        // We strip it here so it appends to the baseURL (e.g. /api/v1).
        if (config.url && config.url.startsWith("/")) {
            config.url = config.url.substring(1);
        }

        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling token refresh on 401 errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If we get a 401 and haven't already retried
        // Don't retry for auth endpoints (login returns 401 for bad credentials, refresh-token failure shouldn't trigger another refresh)
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/auth/")
        ) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                const refreshResponse = await api.post("/auth/refresh-token");
                const { accessToken } = refreshResponse.data;

                // Store new token
                localStorage.setItem("accessToken", accessToken);

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, clear token and redirect to login (but only if not already there)
                localStorage.removeItem("accessToken");
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);