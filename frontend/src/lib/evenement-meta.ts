import {
  Utensils,
  Coins,
  GraduationCap,
  Stethoscope,
  Shirt,
  Moon,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { TypeEvenement } from "../types/evenement";

/**
 * Référentiel unique des types d'événements (libellé, icône, couleurs).
 * Utilisé par la vitrine publique pour garantir la cohérence visuelle.
 */
export interface TypeEvenementMeta {
  label: string;
  icon: LucideIcon;
  /** Couleur de l'icône */
  color: string;
  /** Classes du badge (fond + texte) */
  badge: string;
}

export const TYPE_EVENEMENT_META: Record<TypeEvenement, TypeEvenementMeta> = {
  distribution_alimentaire: {
    label: "Paniers Alimentaires",
    icon: Utensils,
    color: "text-emerald-500",
    badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  },
  collecte_dons: {
    label: "Collecte de Dons",
    icon: Coins,
    color: "text-amber-500",
    badge: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  },
  soutien_scolaire: {
    label: "Soutien Scolaire",
    icon: GraduationCap,
    color: "text-sky-500",
    badge: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  },
  aide_medicale: {
    label: "Aide Médicale",
    icon: Stethoscope,
    color: "text-rose-500",
    badge: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  },
  distribution_vetements: {
    label: "Vêtements & Hiver",
    icon: Shirt,
    color: "text-violet-500",
    badge: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  },
  evenement_religieux: {
    label: "Ramadan / Aïd",
    icon: Moon,
    color: "text-teal-500",
    badge: "bg-teal-500/15 text-teal-700 dark:text-teal-300",
  },
  autre: {
    label: "Autre Action",
    icon: Sparkles,
    color: "text-primary",
    badge: "bg-primary/15 text-primary",
  },
};

export const TYPES_EVENEMENT = Object.keys(TYPE_EVENEMENT_META) as TypeEvenement[];

/** Formatage de date FR court : "12 oct. 2026" */
export const formatDateFr = (iso: string, withTime = false): string =>
  new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime && { hour: "2-digit", minute: "2-digit" }),
  });

/** Déduit la période d'un événement à partir de ses dates */
export const getPeriode = (dateDebut: string, dateFin: string): "a_venir" | "en_cours" | "passes" => {
  const now = Date.now();
  if (new Date(dateDebut).getTime() > now) return "a_venir";
  if (new Date(dateFin).getTime() < now) return "passes";
  return "en_cours";
};
