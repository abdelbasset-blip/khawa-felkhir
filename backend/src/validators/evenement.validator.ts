import { z } from "zod";

export const typeEvenementEnum = z.enum([
  "distribution_alimentaire",
  "collecte_dons",
  "soutien_scolaire",
  "aide_medicale",
  "distribution_vetements",
  "evenement_religieux",
  "autre",
]);

export const statutEvenementEnum = z.enum(["brouillon", "publie", "termine"]);

export type TypeEvenement = z.infer<typeof typeEvenementEnum>;
export type StatutEvenement = z.infer<typeof statutEvenementEnum>;

export const createEvenementSchema = z.object({
  titre: z
    .string({ required_error: "Le titre de l'événement est requis" })
    .min(3, "Le titre doit comporter au moins 3 caractères")
    .trim(),
  description: z
    .string({ required_error: "La description est requise" })
    .min(10, "La description doit comporter au moins 10 caractères"),
  type: typeEvenementEnum,
  dateDebut: z.coerce.date({ required_error: "La date de début est requise" }),
  dateFin: z.coerce.date({ required_error: "La date de fin est requise" }),
  lieu: z
    .string({ required_error: "Le lieu est requis" })
    .min(2, "Le lieu est requis")
    .trim(),
  capaciteMax: z.coerce.number().int().positive().optional().nullable(),
  imageCouverture: z.string().url("URL d'image invalide").optional().nullable().or(z.string().startsWith("data:image")),
  galerie: z.array(z.string()).default([]),
  budget: z.coerce.number().min(0, "Le budget ne peut être négatif").default(0),
  statut: statutEvenementEnum.default("brouillon"),
  organisateurId: z.string().optional().nullable(),
});

export const updateEvenementSchema = createEvenementSchema.partial();

export const queryEvenementsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(9),
  search: z.string().optional(),
  type: typeEvenementEnum.optional(),
  statut: statutEvenementEnum.optional(),
  sortBy: z.enum(["titre", "dateDebut", "dateFin", "budget", "createdAt"]).default("dateDebut"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type CreateEvenementInput = z.infer<typeof createEvenementSchema>;
export type UpdateEvenementInput = z.infer<typeof updateEvenementSchema>;
export type QueryEvenementsInput = z.infer<typeof queryEvenementsSchema>;
