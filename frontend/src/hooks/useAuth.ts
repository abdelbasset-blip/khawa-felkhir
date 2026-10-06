import { useCallback } from "react";
import { useAuthStore } from "../store/auth.store";
import { apiClient } from "../lib/api-client";
import { LoginCredentials, AuthResponse } from "../types/auth";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, setAuth, logout: clearStore, setLoading } =
    useAuthStore();
  const navigate = useNavigate();

  /**
   * Connexion administrateur
   */
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
      setLoading(true);
      try {
        const response = await apiClient.post<AuthResponse>("/auth/login", credentials);
        const { user, accessToken } = response.data.data;

        setAuth(user, accessToken);
        navigate("/admin/dashboard", { replace: true });
        return { success: true };
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Une erreur est survenue lors de la connexion.";
        setLoading(false);
        return { success: false, error: message };
      }
    },
    [setAuth, setLoading, navigate]
  );

  /**
   * Déconnexion complète
   */
  const logout = useCallback(async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // Ignorer l'erreur réseau lors de la déconnexion
    } finally {
      clearStore();
      navigate("/admin/login", { replace: true });
    }
  }, [clearStore, navigate]);

  /**
   * Vérification silencieuse de la session existante au premier chargement
   */
  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.post<AuthResponse>("/auth/refresh");
      const { user, accessToken } = response.data.data;
      setAuth(user, accessToken);
    } catch {
      clearStore();
    } finally {
      setLoading(false);
    }
  }, [setAuth, clearStore, setLoading]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
  };
};
