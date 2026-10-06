import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface RouteNames {
  [key: string]: string;
}

const routeNameMap: RouteNames = {
  admin: "Espace Admin",
  dashboard: "Tableau de bord",
  beneficiaries: "Bénéficiaires",
  beneficiaires: "Bénéficiaires",
  events: "Événements & Actions",
  settings: "Paramètres",
  reports: "Rapports & Statistiques",
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="flex items-center space-x-1.5 text-xs text-muted-foreground">
      <Link
        to="/admin/dashboard"
        className="flex items-center hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted"
        title="Accueil"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>

      {pathnames.map((segment, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const displayName = routeNameMap[segment] || decodeURIComponent(segment);

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight className="w-3 h-3 text-muted-foreground/60 shrink-0" />
            {isLast ? (
              <span className="font-semibold text-foreground px-1 py-0.5 rounded bg-muted/60">
                {displayName}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-foreground transition-colors px-1 py-0.5 rounded hover:bg-muted"
              >
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
