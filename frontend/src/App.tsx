import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { AdminLayout } from "./layouts/AdminLayout";
import { PublicLayout } from "./layouts/PublicLayout";
import { Toaster } from "sonner";
import { Loader2, HeartHandshake } from "lucide-react";

// Lazy loading des pages pour optimiser le temps de chargement initial
const HomePage = lazy(() =>
  import("./pages/public/HomePage").then((m) => ({ default: m.HomePage }))
);
const EvenementsPublicPage = lazy(() =>
  import("./pages/public/EvenementsPublicPage").then((m) => ({ default: m.EvenementsPublicPage }))
);
const EvenementDetailPage = lazy(() =>
  import("./pages/public/EvenementDetailPage").then((m) => ({ default: m.EvenementDetailPage }))
);
const ContactPage = lazy(() =>
  import("./pages/public/ContactPage").then((m) => ({ default: m.ContactPage }))
);
const LoginPage = lazy(() =>
  import("./pages/admin/LoginPage").then((m) => ({ default: m.LoginPage }))
);
const DashboardOverviewPage = lazy(() =>
  import("./pages/admin/DashboardOverviewPage").then((m) => ({ default: m.DashboardOverviewPage }))
);
const BeneficiairesPage = lazy(() =>
  import("./pages/admin/BeneficiairesPage").then((m) => ({ default: m.BeneficiairesPage }))
);
const EvenementsPage = lazy(() =>
  import("./pages/admin/EvenementsPage").then((m) => ({ default: m.EvenementsPage }))
);
const SettingsPage = lazy(() =>
  import("./pages/admin/SettingsPage").then((m) => ({ default: m.SettingsPage }))
);

const PageLoadingFallback: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 p-8 text-muted-foreground">
    <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center animate-pulse">
      <HeartHandshake className="w-6 h-6" />
    </div>
    <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
      <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
      <span>Chargement de la page...</span>
    </div>
  </div>
);

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Toaster richColors position="top-right" closeButton />
        <BrowserRouter>
          <Suspense fallback={<PageLoadingFallback />}>
            <Routes>
              {/* ============================================================ */}
              {/* 1. Vitrine Publique (Phase 5) - Hors AdminLayout             */}
              {/* ============================================================ */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/evenements" element={<EvenementsPublicPage />} />
                <Route path="/evenements/:id" element={<EvenementDetailPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Route>

              {/* ============================================================ */}
              {/* 2. Espace Admin & Authentification                           */}
              {/* ============================================================ */}
              {/* Route publique de connexion admin */}
              <Route path="/admin/login" element={<LoginPage />} />

              {/* Espace protégé Admin avec Layout persistant */}
              <Route path="/admin" element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardOverviewPage />} />
                  <Route path="beneficiaires" element={<BeneficiairesPage />} />
                  <Route path="beneficiaries" element={<Navigate to="/admin/beneficiaires" replace />} />
                  <Route path="events" element={<EvenementsPage />} />
                  <Route path="evenements" element={<EvenementsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
              </Route>

              {/* Redirection par défaut vers l'accueil public */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
