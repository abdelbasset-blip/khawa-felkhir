import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  HeartHandshake,
  Sparkles,
  Heart,
  Menu,
  X,
  Sun,
  Moon,
  Shield,
  CalendarHeart,
  Mail,
  Home,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  onOpenDonation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDonation }) => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: t("nav_home"), href: "/", icon: Home },
    { label: t("nav_events"), href: "/evenements", icon: CalendarHeart },
    { label: t("nav_contact"), href: "/contact", icon: Mail },
  ];

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* 1. Logo Khawa Felkhir */}
        <Link to="/" className="flex items-center gap-3 group focus:outline-none">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-primary to-emerald-600 text-primary-foreground flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">
                Khawa_felkhir
              </span>
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <span className="text-[11px] text-muted-foreground font-medium">
              Solidarité & Entraide Citoyenne
            </span>
          </div>
        </Link>

        {/* 2. Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <NavLink
                key={link.href}
                to={link.href}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        {/* 3. Actions Desktop */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Toggle Langue FR / AR */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="rounded-xl px-2.5 h-10 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted gap-1 border border-border/60"
            aria-label="Changer de langue / تغيير اللغة"
            title="Changer de langue (Français / العربية)"
          >
            <span className="text-sm">{language === "fr" ? "🇹🇳" : "🇫🇷"}</span>
            <span className="font-extrabold">{language === "fr" ? "العربية" : "FR"}</span>
          </Button>

          {/* Toggle Theme */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-xl h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Basculer le thème clair/sombre"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </Button>

          {/* Lien Espace Admin */}
          <Link to="/admin/dashboard">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl text-xs font-semibold gap-1.5 border-border hover:bg-muted"
            >
              <Shield className="w-3.5 h-3.5 text-primary" />
              {t("nav_admin")}
            </Button>
          </Link>

          {/* Bouton CTA Faire un don */}
          <Button
            size="sm"
            onClick={onOpenDonation}
            className="rounded-xl text-xs font-bold gap-1.5 shadow-md shadow-primary/25 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/95 hover:to-emerald-600/95"
          >
            <Heart className="w-3.5 h-3.5 fill-current text-white" />
            {t("nav_donate")}
          </Button>
        </div>

        {/* 4. Bouton Mobile Hamburger */}
        <div className="flex md:hidden items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="rounded-xl px-2 h-9 text-xs font-bold text-muted-foreground border border-border/60"
            aria-label="Changer de langue"
          >
            {language === "fr" ? "عربي" : "FR"}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-xl h-9 w-9 text-muted-foreground"
            aria-label="Basculer le thème"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl h-10 w-10 text-foreground"
            aria-label="Ouvrir le menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Menu Déroulant Mobile */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-border bg-card/98 backdrop-blur-xl px-4 py-5 space-y-4"
          >
            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={closeMobile}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground font-bold shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-border flex flex-col gap-2.5">
              <Button
                onClick={() => {
                  closeMobile();
                  onOpenDonation();
                }}
                className="w-full h-11 rounded-xl text-sm font-bold gap-2 shadow-md shadow-primary/20"
              >
                <Heart className="w-4 h-4 fill-current" />
                Faire un don solidaire
              </Button>

              <Link to="/admin/dashboard" onClick={closeMobile}>
                <Button
                  variant="outline"
                  className="w-full h-10 rounded-xl text-xs font-semibold gap-2 border-border"
                >
                  <Shield className="w-3.5 h-3.5 text-primary" />
                  Accéder à l'espace Admin
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
