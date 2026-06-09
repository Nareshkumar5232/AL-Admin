// AL HIKMATH ENTERPRISES PVT LTD - Admin Panel
// Central API Client — ALL admin requests go through here
// Token key: "admin_token" in localStorage

import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios";

// ── Backend base URL ────────────────────────────────────────────────────────
export const API_BASE_URL = buildApiBaseUrl(
  process.env.NEXT_PUBLIC_API_URL || "https://al-kimath-backend.onrender.com"
);

function buildApiBaseUrl(baseUrl: string) {
  const trimmed = baseUrl.replace(/\/+$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
}

// ── Token helpers ────────────────────────────────────────────────────────────
export const TOKEN_KEY = "admin_token";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  if (typeof window === "undefined") return;
  console.log("[AdminAuth] Token stored in localStorage:", token ? "✅ present" : "❌ missing");
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  if (typeof window === "undefined") return;
  console.log("[AdminAuth] Token and Zustand persistent store cleared from localStorage");
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("al-hikmath-admin-auth");
}

// ── Axios instance ───────────────────────────────────────────────────────────
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// REQUEST interceptor — attach token to every request
apiClient.interceptors.request.use((config) => {
  const token = getAdminToken();
  console.log(
    `[AdminAuth] → ${config.method?.toUpperCase()} ${config.url} | Token: ${
      token ? "✅ attached" : "❌ MISSING"
    }`
  );
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Let Axios set Content-Type automatically for FormData
  if (config.data instanceof FormData && config.headers) {
    delete config.headers["Content-Type"];
  }
  return config;
});

// RESPONSE interceptor — handle 401 globally
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn("[AdminAuth] 401 Unauthorized — clearing token and redirecting to login");
      clearAdminToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login?reason=session_expired";
      }
    }
    return Promise.reject(error);
  }
);

// ── Error message extractor ──────────────────────────────────────────────────
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    return (
      axiosError.response?.data?.message ||
      axiosError.response?.data?.error ||
      axiosError.message
    );
  }
  return error instanceof Error ? error.message : "Unknown API error";
}

// ── Generic request wrapper (uses apiClient axios instance) ──────────────────
async function request<T>(
  endpoint: string,
  config: AxiosRequestConfig = {}
): Promise<T> {
  const response = await apiClient.request<T>({ url: endpoint, ...config });
  return response.data;
}

// ── Convenience methods exported for all services ────────────────────────────
export const adminApi = {
  get: <T>(endpoint: string, params?: Record<string, unknown>) =>
    request<T>(endpoint, { method: "GET", params }),

  post: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, { method: "POST", data }),

  put: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, { method: "PUT", data }),

  patch: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, { method: "PATCH", data }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: "DELETE" }),

  // FormData upload — token is attached by the request interceptor
  upload: async <T>(endpoint: string, formData: FormData): Promise<T> => {
    const response = await apiClient.post<T>(endpoint, formData);
    return response.data;
  },
};

// ── Legacy apiService shim (keeps backward compatibility) ────────────────────
// All methods now delegate to adminApi so the axios interceptor always runs
export const apiService = {
  get: <T>(endpoint: string) => adminApi.get<T>(endpoint),
  post: <T>(endpoint: string, body?: unknown) => adminApi.post<T>(endpoint, body),
  put: <T>(endpoint: string, body?: unknown) => adminApi.put<T>(endpoint, body),
  delete: <T>(endpoint: string) => adminApi.delete<T>(endpoint),
  setAuthToken: (token: string) => setAdminToken(token),
  clearAuth: () => clearAdminToken(),
};
