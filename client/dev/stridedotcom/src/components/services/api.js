import axios from "axios"

export const api = axios.create({
    baseURL: "http://localhost:9090/api/v1",
    withCredentials: true,  // for authenticated requests (cookies for refresh token)
})

// Request interceptor to add JWT token to Authorization header
api.interceptors.request.use(
    (config) => {
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