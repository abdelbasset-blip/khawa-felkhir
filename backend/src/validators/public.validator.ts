import { z } from "zod";

/**
 * Validators des endpoints PUBLICS (vitrine) — aucune authentification requise.
 * Les entrées sont strictement bornées pour limiter les abus.
 */

const TYPES_EVENEMENT = [
  "distribution_alimentaire",
  "collecte_dons",
  "soutien_scolaire",
  "aide_medicale",
  "distribution_vetements",
  "evenement_religieux",
  "autre",
] as const;

/** Onglets de la page /evenements : à venir | en cours | passés */
export const PERIODES = ["a_venir", "en_cours", "passes"] as const;

export const publicEvenementsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(9),
  periode: z.enum(PERIODES).optional(),
  type: z.enum(TYPES_EVENEMENT).optional(),
  search: z.string().trim().max(100).optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
});

/** Supprime les balises HTML éventuelles (sanitisation basique côté serveur) */
const sanitized = (min: number, max: number, label: string) =>
  z
    .string()
    .trim()
    .min(min, `${label} doit comporter au moins ${min} caractères`)
    .max(max, `${label} ne doit pas dépasser ${max} caractères`)
    .transform((v) => v.replace(/<[^>]*>/g, ""));

const telephoneOptionnel = z
  .string()
  .trim()
  .max(20)
  .regex(/^[+0-9\s().-]*$/, "Numéro de téléphone invalide")
  .optional()
  .or(z.literal("").transform(() => undefined));

export const inscriptionSchema = z.object({
  nom: sanitized(2, 100, "Le nom"),
  email: z.string().trim().toLowerCase().email("Adresse email invalide").max(150),
  telephone: telephoneOptionnel,
  message: sanitized(0, 500, "Le message").optional(),
});

export const contactSchema = z.object({
  nom: sanitized(2, 100, "Le nom"),
  email: z.string().trim().toLowerCase().email("Adresse email invalide").max(150),
  telephone: telephoneOptionnel,
  sujet: sanitized(3, 150, "Le sujet"),
  message: sanitized(10, 2000, "Le message"),
});

export type InscriptionInput = z.infer<typeof inscriptionSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
