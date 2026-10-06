import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { Breadcrumbs } from "./Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  Bell,
  Sun,
  Moon,
  Menu,
  Search,
  CheckCheck,
  Heart,
  UserPlus,
  CalendarCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AdminTopbarProps {
  onOpenMobileMenu: () => void;
}

export const AdminTopbar: React.FC<AdminTopbarProps> = ({ onOpenMobileMenu }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    {
      id: "1",
      icon: UserPlus,
      color: "text-emerald-500 bg-emerald-500/10",
      title: "Nouveau bénéficiaire",
      description: "Famille Benali enregistrée dans le quartier El Amal",
      time: "Il y a 10 min",
      unread: true,
    },
    {
      id: "2",
      icon: Heart,
      color: "text-rose-500 bg-rose-500/10",
      title: "Don confirmé",
      description: "Donation de 1,200 DT reçue pour l'action Rentrée Scolaire",
      time: "Il y a 1h",
      unread: true,
    },
    {
      id: "3",
      icon: CalendarCheck,
      color: "text-sky-500 bg-sky-500/10",
      title: "Campagne validée",
      description: "Caravane Médicale Sud programmée pour ce samedi",
      time: "Hier",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-4 lg:px-6">
      {/* 1. Bouton Drawer Mobile & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenMobileMenu}
          className="md:hidden text-foreground hover:bg-muted"
          aria-label="Ouvrir le menu latéral"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <div className="hidden sm:block">
          <Breadcrumbs />
        </div>
      </div>

      {/* 2. Barre de recherche globale rapide */}
      <div className="hidden lg:flex items-center relative w-72">
        <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher bénéficiaire, action..."
          className="w-full h-9 pl-9 pr-4 text-xs rounded-full border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-foreground placeholder:text-muted-foreground/70"
        />
      </div>

      {/* 3. Actions Topbar (Dark mode, Notifications, Avatar) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Toggle Langue FR / AR */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLanguage}
          className="h-9 px-2 text-xs font-bold text-foreground hover:bg-muted border border-border/60 rounded-full"
          aria-label="Changer de langue"
          title="Changer de langue (FR / العربية)"
        >
          <span className="mr-1">{language === "fr" ? "🇹🇳" : "🇫🇷"}</span>
          <span>{language === "fr" ? "عربي" : "FR"}</span>
        </Button>

        {/* Toggle Dark Mode */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9 rounded-full text-foreground hover:bg-muted transition-transform active:rotate-45"
          title={theme === "dark" ? "Passer au thème clair" : "Passer au thème sombre"}
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </Button>

        {/* Bouton & Menu Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="h-9 w-9 rounded-full relative text-foreground hover:bg-muted"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-background animate-pulse" />
            )}
          </Button>

          {/* Popover Notifications */}
          <AnimatePresence>
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-border bg-card shadow-2xl p-4 z-50 overflow-hidden"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">Notifications</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {unreadCount} nouvelles
                      </span>
                    </div>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Tout marquer lu
                    </button>
                  </div>

                  <div className="mt-2 divide-y divide-border/60 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="py-2.5 flex items-start gap-3 hover:bg-muted/40 p-2 rounded-xl transition-colors cursor-pointer"
                      >
                        <div
                          className={`h-8 w-8 rounded-lg ${n.color} flex items-center justify-center shrink-0 mt-0.5`}
                        >
                          <n.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">
                            {n.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground line-clamp-2">
                            {n.description}
                          </p>
                          <span className="text-[10px] text-muted-foreground/70 mt-1 block">
                            {n.time}
                          </span>
                        </div>
                        {n.unread && (
                          <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Profil & Menu Utilisateur */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1 pl-2 rounded-full hover:bg-muted transition-colors border border-transparent hover:border-border"
          >
            <Avatar
              size="sm"
              fallback={`${user?.firstName?.charAt(0) || "A"}${user?.lastName?.charAt(0) || "D"}`}
            />
            <div className="hidden md:flex flex-col text-left mr-1">
              <span className="text-xs font-bold leading-tight">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-[10px] text-muted-foreground capitalize">
                {user?.role?.toLowerCase()}
              </span>
            </div>
          </button>

          {/* Dropdown Menu Utilisateur */}
          <AnimatePresence>
            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-card shadow-2xl p-2 z-50 text-xs"
                >
                  <div className="px-3 py-2 border-b border-border mb-1">
                    <p className="font-bold text-foreground truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-muted-foreground text-[11px] truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <a
                      href="#profile"
                      className="block px-3 py-2 rounded-lg hover:bg-muted text-foreground transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Mon Profil
                    </a>
                    <a
                      href="#settings"
                      className="block px-3 py-2 rounded-lg hover:bg-muted text-foreground transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Paramètres de sécurité
                    </a>
                  </div>
                  <div className="pt-1 border-t border-border mt-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive font-medium transition-colors"
                    >
                      Se déconnecter
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
