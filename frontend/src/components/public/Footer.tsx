import React from "react";
import { Link } from "react-router-dom";
import {
  HeartHandshake,
  Heart,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Sparkles,
  Shield,
} from "lucide-react";

interface FooterProps {
  onOpenDonation: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDonation }) => {
  return (
    <footer className="border-t border-border/80 bg-muted/30 dark:bg-card/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* 1. Marque et Mission (col-span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group focus:outline-none">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-primary to-emerald-600 text-primary-foreground flex items-center justify-center shadow-md shadow-primary/20">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-foreground">
                    Khawa_felkhir
                  </span>
                  <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  Association Caritative & Humanitaire
                </span>
              </div>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Khawa Felkhir est une organisation caritative citoyenne tunisienne dédiée
              au soutien des familles démunies, à l'accès aux soins de santé et à la réussite
              scolaire des enfants des zones défavorisées.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="h-9 w-9 rounded-xl border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="h-9 w-9 rounded-xl border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="h-9 w-9 rounded-xl border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="h-9 w-9 rounded-xl border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* 2. Navigation Rapide */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/evenements" className="hover:text-primary transition-colors">
                  Toutes les actions
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenDonation}
                  className="hover:text-primary transition-colors text-left flex items-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5 text-primary fill-primary" />
                  Faire un don
                </button>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Contact & Permanence
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Nos Domaines d'Action */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Nos Piliers
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Paniers Alimentaires & Ramadan</li>
              <li>Caravanes Médicales Rurales</li>
              <li>Soutien Scolaire & Rénovation</li>
              <li>Vêtements Chauds & Hiver</li>
              <li>Secours d'Urgence Familial</li>
            </ul>
          </div>

          {/* 4. Contact & Permanence */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Coordonnées
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>12 Rue de la Solidarité, 1002 Tunis, Tunisie</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>+216 71 234 567 / 98 123 456</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>contact@khawa-felkhir.org</span>
              </li>
              <li className="pt-2">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Connexion administration
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Barre de pied de page inférieure */}
        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Khawa Felkhir. Tous droits réservés. Association reconnue
            d'utilité publique.
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 font-medium text-foreground/80">
              Conçu avec <Heart className="w-3.5 h-3.5 text-primary fill-primary" /> pour la Tunisie
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
