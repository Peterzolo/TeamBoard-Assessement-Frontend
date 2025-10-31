import axios, {
  type AxiosRequestConfig,
  AxiosError,
  type AxiosResponse,
} from "axios";
import { localStore } from "../localStore";

import { StorageVariable } from "../constants/storageVariables";
import store from "../../app/redux/store/store";
import { setLogoutRequestStart } from "../../app/redux/reducers/auth/signUpReducer";

// const productionUrl = process.env.NEXT_PUBLIC_API_URL;
const devServerUrl = "http://localhost:5000/api/v1";

const baseURL = devServerUrl;

const apiRequest = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Always send cookies
});

// Enhanced error handling interface
interface AuthErrorResponse {
  message: string;
  code?: string;
  shouldLogout?: boolean;
  statusCode?: number;
}

// Authentication error handler
const handleAuthError = (
  error: AxiosError,
  config: AxiosRequestConfig & { logoutOnAuthError?: boolean }
) => {
  const status = error?.response?.status;
  const errorData = error?.response?.data as AuthErrorResponse;

  // Always handle 401 (Unauthorized) - token expired, invalid, etc.
  if (status === 401) {
    console.log("Authentication error detected:", {
      status,
      message: errorData?.message,
      code: errorData?.code,
    });

    // Clear all authentication data
    localStore.clearLocalStore();

    // Clear any auth-related cookies (if any are stored client-side)
    if (typeof document !== "undefined") {
      document.cookie =
        "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    // Dispatch logout action to update Redux state
    store.dispatch(setLogoutRequestStart());

    // Show user notification (you can integrate with your notification system)
    showAuthNotification(
      errorData?.message || "Session expired. Please log in again."
    );

    // Redirect to login page or reload
    if (typeof window !== "undefined") {
      // Option 1: Redirect to login page (recommended)
      window.location.href = "/";

      // Option 2: Reload the page (if you prefer)
      // window.location.reload();
    }

    return true; // Indicates auth error was handled
  }

  // Handle 403 (Forbidden) - user doesn't have permission
  if (status === 403) {
    console.log("Forbidden access:", errorData?.message);

    // Show user notification
    showAuthNotification(
      errorData?.message ||
        "You do not have permission to access this resource."
    );

    // Optionally redirect to unauthorized page
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }

    return true;
  }

  return false; // No auth error handled
};

// Notification helper (integrate with your notification system)
const showAuthNotification = (message: string) => {
  // Replace this with your actual notification system
  console.warn("Auth Error:", message);

  // Example integration with a notification library:
  // toast.error(message);
  // or
  // notification.error({
  //   message: 'Authentication Error',
  //   description: message,
  // });
};

// Enhanced request function with better error handling
export const request = async (
  config: AxiosRequestConfig & { logoutOnAuthError?: boolean }
) => {
  try {
    // Always send credentials for every request
    const response: AxiosResponse = await apiRequest({
      ...config,
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    const axiosError = error as AxiosError;

    // Special handling for complete signup endpoint - don't auto-redirect on 401
    if (
      config.url?.includes("/users/complete-profile") &&
      axiosError?.response?.status === 401
    ) {
      console.log("Complete signup 401 error - not redirecting automatically");
      const errorData = axiosError?.response?.data;
      const errorMessage =
        (errorData as any)?.message || errorData || "Invalid or expired token";
      throw new Error(errorMessage);
    }

    // Handle authentication errors for other endpoints
    const authErrorHandled = handleAuthError(axiosError, config);

    if (authErrorHandled) {
      // Don't throw the error for auth issues since we've already handled them
      throw new Error("Authentication failed");
    }

    // Handle other types of errors
    const status = axiosError?.response?.status;
    const errorData = axiosError?.response?.data;

    // Log error for debugging
    console.error("API Error:", {
      status,
      url: config.url,
      method: config.method,
      error: errorData,
    });

    // Always throw a consistent error object
    const errorMessage =
      (errorData as any)?.message ||
      errorData ||
      axiosError?.message ||
      "An unknown error occurred.";

    throw new Error(errorMessage);
  }
};

// Enhanced request with automatic retry for network errors
export const requestWithRetry = async (
  config: AxiosRequestConfig & { logoutOnAuthError?: boolean; retries?: number }
) => {
  const maxRetries = config.retries || 3;
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await request(config);
    } catch (error: any) {
      lastError = error;

      // Don't retry on authentication errors
      if (error.message === "Authentication failed") {
        throw error;
      }

      // Don't retry on client errors (4xx) except network issues
      const status = error?.response?.status;
      if (status && status >= 400 && status < 500 && status !== 408) {
        throw error;
      }

      // Retry on server errors (5xx) or network issues
      if (attempt < maxRetries) {
        console.log(`Request failed, retrying... (${attempt}/${maxRetries})`);
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
      }
    }
  }

  throw lastError;
};

// Utility function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  try {
    // Check if user data exists in local storage
    const userData = localStore.getItem(StorageVariable.USER_DATA);
    return !!userData;
  } catch (error) {
    return false;
  }
};

// Utility function to get auth headers
export const getAuthHeaders = () => {
  const userData = localStore.getItem(StorageVariable.USER_DATA);
  if (userData) {
    try {
      const parsedUser =
        typeof userData === "string" ? JSON.parse(userData) : userData;
      return parsedUser.token
        ? { Authorization: `Bearer ${parsedUser.token}` }
        : {};
    } catch {
      return {};
    }
  }
  return {};
};

// Enhanced API request with auth headers
export const authenticatedRequest = async (
  config: AxiosRequestConfig & { logoutOnAuthError?: boolean }
) => {
  const authHeaders = getAuthHeaders();

  return request({
    ...config,
    headers: {
      ...authHeaders,
      ...config.headers,
    } as any, // Type assertion to avoid header type conflicts
    logoutOnAuthError: config.logoutOnAuthError ?? true, // Default to true for authenticated requests
  });
};

// Request interceptor for adding auth headers automatically
apiRequest.interceptors.request.use(
  (config) => {
    // Add auth headers if available
    const authHeaders = getAuthHeaders();
    if (Object.keys(authHeaders).length > 0) {
      config.headers = {
        ...config.headers,
        ...authHeaders,
      } as any; // Type assertion to avoid header type conflicts
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
apiRequest.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Global error handling - this will catch any errors not handled in the request function
    const status = error?.response?.status;

    if (status === 401) {
      // This is a fallback in case the request function doesn't handle it
      handleAuthError(error, { logoutOnAuthError: true });
    }

    return Promise.reject(error);
  }
);

export default apiRequest;
