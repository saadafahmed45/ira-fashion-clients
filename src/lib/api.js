import axios from "axios";
import { brand } from "@/config/brand";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://ira-fashion-server.vercel.app/api/v1";
const TOKEN_KEY = brand.tokenKey;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      let token = localStorage.getItem(TOKEN_KEY);

      if (!token) {
        try {
          const { getAuth } = await import("firebase/auth");
          const { app } = await import("@/app/firebase/firebase.init");
          const auth = getAuth(app);
          const currentUser = auth.currentUser;
          if (currentUser) {
            token = await currentUser.getIdToken();
          }
        } catch {
          // Firebase not available — proceed without token
        }
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    const message = error.response?.data?.message || "Something went wrong";
    const errors = error.response?.data?.errors || null;
    return Promise.reject({ message, errors, statusCode: error.response?.status || 500 });
  }
);

export default api;
export { API_URL };
