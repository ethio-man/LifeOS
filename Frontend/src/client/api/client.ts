import axios from "axios";

const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
const normalizedApiUrl = rawApiUrl.replace(/\/$/, "");
/** Base URL for `/activities`, `/config`, etc. (must be the backend origin, not the static frontend host). */
export const resolvedApiBaseUrl = normalizedApiUrl.endsWith("/api")
  ? normalizedApiUrl
  : `${normalizedApiUrl}/api`;

export const apiClient = axios.create({
  baseURL: resolvedApiBaseUrl,
});

if (typeof window !== "undefined") {
  try {
    if (new URL(resolvedApiBaseUrl).origin === window.location.origin) {
      console.warn(
        "[LifeOS] VITE_API_URL points at this same site. Set it to your Backend deployment URL (https://<backend-project>.vercel.app/api), then redeploy the frontend.",
      );
    }
  } catch {
    /* ignore malformed URL */
  }
}

// Interceptor to add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("lifeos_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export * from "./endpoints";
