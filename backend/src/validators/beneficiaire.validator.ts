import { z } from "zod";

export const typeAideEnum = z.enum([
  "alimentaire",
  "medical",
  "scolaire",
  "vestimentaire",
  "financier",
  "autre",
]);

export const statutBeneficiaireEnum = z.enum(["en_attente", "valide", "aide"]);

export type TypeAide = z.infer<typeof typeAideEnum>;
export type StatutBeneficiaire = z.infer<typeof statutBeneficiaireEnum>;

export const createBeneficiaireSchema = z.object({
  nom: z.string({ required_error: "Le nom est requis" }).min(2, "Le nom doit comporter au moins 2 caractères").trim(),
  prenom: z.string({ required_error: "Le prénom est requis" }).min(2, "Le prénom doit comporter au moins 2 caractères").trim(),
  cin: z.string({ required_error: "Le numéro CIN est requis" }).min(4, "Le CIN doit comporter au moins 4 caractères").trim(),
  telephone: z.string({ required_error: "Le numéro de téléphone est requis" }).min(8, "Numéro de téléphone invalide").trim(),
  adresse: z.string({ required_error: "L'adresse est requise" }).min(3, "L'adresse doit être précisée").trim(),
  ville: z.string({ required_error: "La ville est requise" }).min(2, "La ville est requise").trim(),
  situationFamiliale: z.string().default("Marié(e)"),
  nbEnfants: z.coerce.number().int().min(0, "Le nombre d'enfants ne peut être négatif").default(0),
  typeAide: typeAideEnum,
  statut: statutBeneficiaireEnum.default("en_attente"),
  notes: z.string().optional().nullable(),
  documents: z.array(z.string()).default([]),
});

export const updateBeneficiaireSchema = createBeneficiaireSchema.partial();

export const queryBeneficiairesSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  type_aide: typeAideEnum.optional(),
  statut: statutBeneficiaireEnum.optional(),
  sortBy: z.enum(["nom", "prenom", "dateAjout", "statut", "nbEnfants"]).default("dateAjout"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateBeneficiaireInput = z.infer<typeof createBeneficiaireSchema>;
export type UpdateBeneficiaireInput = z.infer<typeof updateBeneficiaireSchema>;
export type QueryBeneficiairesInput = z.infer<typeof queryBeneficiairesSchema>;
