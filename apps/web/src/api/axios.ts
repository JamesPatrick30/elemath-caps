import axios from "axios";
import { refreshAccessToken } from "./api";
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // sends refresh/access cookies
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      return refreshAccessToken().then((newAccessToken) => {
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios.request(error.config);
      });
    }
    return Promise.reject(error);
  }
);