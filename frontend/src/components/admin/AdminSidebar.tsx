import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  CalendarHeart,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  HeartHandshake,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AdminSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onNavigateMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  onNavigateMobile,
}) => {
  const { user, logout } = useAuth();

  const navItems = [
    {
      title: "Tableau de bord",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      title: "Bénéficiaires",
      href: "/admin/beneficiaires",
      icon: Users,
      badge: "7 actifs",
    },
    {
      title: "Événements & Actions",
      href: "/admin/events",
      icon: CalendarHeart,
      badge: "6 actifs",
    },
    {
      title: "Paramètres",
      href: "/admin/settings",
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside
      className={cn(
        "relative flex flex-col h-screen border-r border-border bg-card/95 backdrop-blur-md transition-all duration-300 z-30 select-none",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* 1. Header Marque Khawa_felkhir */}
      <div className="h-16 flex items-center px-4 border-b border-border/80 justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-tr from-primary to-emerald-600 text-primary-foreground flex items-center justify-center shadow-md shadow-primary/20">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col min-w-0"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight truncate text-foreground">
                    Khawa_felkhir
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                </div>
                <span className="text-[11px] text-muted-foreground truncate font-medium">
                  Portail Solidaire Admin
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 2. Bouton de repli Desktop */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden md:flex absolute -right-3.5 top-20 z-40 h-7 w-7 items-center justify-center rounded-full border border-border bg-background shadow-md hover:bg-accent text-muted-foreground hover:text-foreground transition-all"
        title={isCollapsed ? "Agrandir le menu" : "Réduire le menu"}
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* 3. Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin">
        {!isCollapsed && (
          <p className="px-3 text-[11px] font-bold text-muted-foreground/70 uppercase tracking-wider mb-2">
            Gestion Principale
          </p>
        )}

        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={onNavigateMobile}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25 font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
              )
            }
          >
            <item.icon
              className={cn(
                "w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110",
                isCollapsed && "mx-auto"
              )}
            />

            {!isCollapsed && (
              <div className="flex flex-1 items-center justify-between overflow-hidden">
                <span className="truncate">{item.title}</span>
                {item.badge && (
                  <span
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide",
                      "bg-secondary text-secondary-foreground"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            )}

            {/* Tooltip flottant si le menu est réduit */}
            {isCollapsed && (
              <div className="absolute left-full ml-3 px-2.5 py-1 bg-foreground text-background text-xs rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                {item.title}
              </div>
            )}
          </NavLink>
        ))}
      </div>

      {/* 4. Section Bas de page : Utilisateur & Déconnexion */}
      <div className="p-3 border-t border-border/80 bg-muted/30 space-y-2">
        {!isCollapsed && user && (
          <div className="flex items-center gap-3 p-2 rounded-xl bg-card border border-border/60">
            <div className="h-9 w-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 ring-2 ring-primary/20">
              {user.firstName?.charAt(0)}
              {user.lastName?.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-foreground truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
            </div>
            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-primary/15 text-primary border border-primary/25">
              {user.role}
            </span>
          </div>
        )}

        <button
          onClick={() => {
            if (onNavigateMobile) onNavigateMobile();
            logout();
          }}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors",
            isCollapsed && "justify-center"
          )}
          title="Déconnexion"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span>Se déconnecter</span>}
        </button>
      </div>
    </aside>
  );
};
