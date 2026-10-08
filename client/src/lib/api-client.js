import { HOST } from "@/utils/constants";
import axios from "axios";

const apiClient = axios.create({
    baseURL: HOST,
    withCredentials: true
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      error.response?.data?.error === "jwt expired"
    ) {
      originalRequest._retry = true;

      try {
        const refreshRes = await apiClient.post("/auth/refresh-token");

        const newAccessToken = refreshRes.data.data.accessToken;

        // Attach new token and retry original request
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (refreshErr) {
        console.error("Refresh token failed", refreshErr);
        // You can log out user here
      }
    }

    return Promise.reject(error);
  }
);

export {apiClient};