import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/auth.store";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Nécessaire pour envoyer et recevoir le cookie HttpOnly de refresh
  headers: {
    "Content-Type": "application/json",
  },
});

// File d'attente pour les requêtes en attente pendant un refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (token) {
      promise.resolve(token);
    } else {
      promise.reject(error);
    }
  });
  failedQueue = [];
};

// 1. Intercepteur de Requête : Injection du Bearer token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Intercepteur de Réponse : Gestion de l'expiration 401 et Silent Refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Si l'erreur n'est pas 401 ou si la requête a déjà été rejouée ou s'il s'agit de la route login/refresh
    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Si un rafraîchissement est déjà en cours, mettre en attente la requête
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(apiClient(originalRequest));
          },
          reject: (err) => {
            reject(err);
          },
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Tentative de refresh via le cookie HttpOnly
      const response = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      );

      const newAccessToken = response.data?.data?.accessToken;
      const user = response.data?.data?.user;

      if (newAccessToken && user) {
        useAuthStore.getState().setAuth(user, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        processQueue(null, newAccessToken);
        return apiClient(originalRequest);
      } else {
        throw new Error("Tokens manquants dans la réponse de refresh");
      }
    } catch (refreshError) {
      processQueue(refreshError, null);
      useAuthStore.getState().logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
