import React, { useEffect } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, checkAuth } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Si l'utilisateur n'est pas authentifié en mémoire, tente une reconnexion silencieuse
    if (!isAuthenticated) {
      checkAuth();
    }
  }, [isAuthenticated, checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-muted-foreground gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium tracking-wide">Vérification de la session sécurisée...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
