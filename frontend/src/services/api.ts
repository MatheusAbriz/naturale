import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/stores/auth-store";

const API_URL = import.meta.env.VITE_APP_BASE_URL;

export const API = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const { user } = useAuth.getState();
    const token = user?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 403) {
      await useAuth.getState().logout();
      toast.error("Sessão expirada, faça login novamente!");
    }
    return Promise.reject(error);
  }
);
