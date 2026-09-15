import axios from "axios";
import { toast } from "sonner";

export const BASE_URL =
  import.meta.env.VITE_BASE_URL || "https://elanis.runasp.net";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || `${BASE_URL.replace(/\/+$/, "")}/api`;

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor — attach Bearer token
 */
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Flag to prevent multiple simultaneous refresh attempts
 */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Response interceptor — unwrap envelope, handle 401 refresh
 */
axiosClient.interceptors.response.use(
  (response) => {
    // Unwrap the API envelope: { statusCode, succeeded, message, errors, data }
    const envelope = response.data;

    if (envelope && typeof envelope.succeeded !== "undefined") {
      if (!envelope.succeeded) {
        // API returned a failure envelope — reject so caller's onError handles it
        const errorMessage =
          envelope.errors?.length > 0
            ? envelope.errors.join(", ")
            : envelope.message || "An error occurred";
        return Promise.reject(new Error(errorMessage));
      }
      // Return unwrapped data
      return envelope.data;
    }

    // If response doesn't follow envelope pattern, return as-is
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 — attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue requests while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(
          `${API_BASE_URL}/Account/refresh-token`,
          JSON.stringify(refreshToken),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const envelope = response.data;
        if (!envelope?.succeeded) {
          throw new Error("Token refresh failed");
        }

        const { accessToken, refreshToken: newRefreshToken } = envelope.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        axiosClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Clear auth state and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";

        toast.error("Session expired. Please log in again.");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other error responses
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.join(", ") ||
      error.message ||
      "An unexpected error occurred";

    // Only toast globally for 5xx server errors or network disconnects.
    // 4xx client errors (400 Bad Request, 404 Not Found, 422) are handled
    // by the calling form/mutation to prevent duplicate notifications.
    const status = error.response?.status;
    if (!axios.isCancel(error) && (!status || status >= 500)) {
      toast.error("Server error", {
        id: "global-server-error",
        description: message,
      });
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
