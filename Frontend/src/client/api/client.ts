import axios from "axios";

const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
const normalizedApiUrl = rawApiUrl.replace(/\/$/, "");
const API_URL = normalizedApiUrl.endsWith("/api")
  ? normalizedApiUrl
  : `${normalizedApiUrl}/api`;

export const apiClient = axios.create({
  baseURL: API_URL,
});

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
