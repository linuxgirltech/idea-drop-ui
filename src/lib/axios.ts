import axios from "axios";
import { getStoredAccessToken, setStoredAccessToken } from "./authToken";
import { refreshAccessToken } from "#/api/auth";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token on refresh
api.interceptors.request.use((config) => {
  const token = getStoredAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Refresh token after expire
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalReq = err.config;

    if (
      err.response?.status === 401 &&
      originalReq._retry &&
      originalReq.url.includes("/auth/refresh")
    ) {
      originalReq._retry = true;

      try {
        const { accessToken: newToken } = await refreshAccessToken();
        setStoredAccessToken(newToken);
        originalReq.headers.Authorization = `Bearer ${newToken}`;
        return api(originalReq);
      } catch (err) {
        console.error(err);
      }
    }

    return Promise.reject(err);
  },
);

export default api;
