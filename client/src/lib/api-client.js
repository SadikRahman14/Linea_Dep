import axios from "axios";
import {
  HOST,
  AUTH_ROUTES,
  SIGNUP_ROUTES,
  LOGIN_ROUTES,
} from "@/utils/constants";

const apiClient = axios.create({ baseURL: HOST, withCredentials: true });
let refreshPromise;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthAction = [SIGNUP_ROUTES, LOGIN_ROUTES, `${AUTH_ROUTES}/refresh-token`]
      .some((path) => originalRequest?.url?.includes(path));

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry || isAuthAction) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    try {
      // Concurrent 401 responses share one refresh request (refresh tokens rotate).
      refreshPromise ||= axios.post(`${HOST}/${AUTH_ROUTES}/refresh-token`, {}, {
        withCredentials: true,
      }).finally(() => { refreshPromise = undefined; });
      await refreshPromise;
      // Browsers automatically send the refreshed httpOnly accessToken cookie.
      return apiClient(originalRequest);
    } catch {
      return Promise.reject(error);
    }
  }
);

export { apiClient };
