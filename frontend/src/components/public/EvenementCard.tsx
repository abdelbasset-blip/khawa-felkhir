import React from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, ArrowRight, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SocialShareButtons } from "./SocialShareButtons";
import { TYPE_EVENEMENT_META, formatDateFr, getPeriode } from "../../lib/evenement-meta";
import { stripMarkdown } from "../common/MarkdownRenderer";
import type { PublicEvenement } from "../../types/public";
import { motion } from "framer-motion";

interface EvenementCardProps {
  evenement: PublicEvenement;
  onOpenDonation?: (eventTitle: string) => void;
  index?: number;
}

export const EvenementCard: React.FC<EvenementCardProps> = ({
  evenement,
  index = 0,
}) => {
  const meta = TYPE_EVENEMENT_META[evenement.type] || TYPE_EVENEMENT_META.autre;
  const TypeIcon = meta.icon;
  const periode = getPeriode(evenement.dateDebut, evenement.dateFin);

  const places = evenement.placesPrises ?? 0;
  const max = evenement.capaciteMax || 0;
  const pct = max > 0 ? Math.min(100, Math.round((places / max) * 100)) : 0;
  const isFull = max > 0 && places >= max;

  const renderPeriodeBadge = () => {
    switch (periode) {
      case "a_venir":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/90 text-white shadow-sm">
            <Clock className="w-3 h-3" /> À venir
          </span>
        );
      case "en_cours":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/90 text-white shadow-sm animate-pulse">
            <Sparkles className="w-3 h-3" /> En cours
          </span>
        );
      case "passes":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-black/60 text-white/90 backdrop-blur-md">
            <CheckCircle2 className="w-3 h-3" /> Action réalisée
          </span>
        );
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group flex flex-col rounded-3xl border border-border/80 bg-card overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* 1. Image de Couverture */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-muted">
        <Link to={`/evenements/${evenement.id}`} tabIndex={-1}>
          {evenement.imageCouverture ? (
            <img
              src={evenement.imageCouverture}
              alt={evenement.titre}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-primary/20 via-background to-secondary flex items-center justify-center text-primary font-extrabold text-xl">
              Khawa Felkhir
            </div>
          )}
        </Link>

        {/* Badge Période Flottant en haut à droite */}
        <div className="absolute top-3 right-3">{renderPeriodeBadge()}</div>

        {/* Badge Type d'action Flottant en bas à gauche */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/85 dark:bg-card/90 backdrop-blur-md text-foreground text-xs font-bold shadow-sm">
          <TypeIcon className={`w-3.5 h-3.5 ${meta.color}`} />
          <span>{meta.label}</span>
        </div>
      </div>

      {/* 2. Corps de la Carte */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <Link to={`/evenements/${evenement.id}`}>
            <h3 className="font-extrabold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {evenement.titre}
            </h3>
          </Link>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {stripMarkdown(evenement.description)}
          </p>
        </div>

        {/* Métadonnées : Date & Lieu */}
        <div className="space-y-2 pt-3 border-t border-border/60 text-xs text-muted-foreground">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              {formatDateFr(evenement.dateDebut)}
            </span>
            <span className="flex items-center gap-1.5 truncate text-muted-foreground">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
              {evenement.lieu}
            </span>
          </div>

          {/* Barre de Progression des Inscriptions / Bénévoles */}
          {max > 0 ? (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 font-semibold text-foreground">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  {isFull ? (
                    <span className="text-amber-500 font-bold">Complet ({places} participants)</span>
                  ) : (
                    <span>
                      {places} / {max} bénévoles mobilisés
                    </span>
                  )}
                </span>
                <span className="font-bold text-primary">{pct}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isFull
                      ? "bg-amber-500"
                      : pct > 75
                      ? "bg-emerald-500"
                      : "bg-gradient-to-r from-primary to-emerald-500"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span>Ouvert à tous sans limite de place</span>
            </div>
          )}
        </div>

        {/* 3. Pied de Carte : Partage Social & Bouton Détails */}
        <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
          {/* Boutons de partage social sur chaque carte */}
          <SocialShareButtons evenement={evenement} size="sm" showCopy={false} />

          <Link to={`/evenements/${evenement.id}`}>
            <Button
              size="sm"
              variant="default"
              className="rounded-xl text-xs font-bold gap-1.5 shadow-sm group/btn"
            >
              Détails
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.article>
  );
};
