import { z } from "zod";

export const updateSettingsSchema = z.object({
  nom: z.string().min(2, "Le nom doit comporter au moins 2 caractères").optional(),
  sigle: z.string().min(1, "Le sigle est requis").optional(),
  description: z.string().optional(),
  matriculeFiscal: z.string().min(3, "Matricule fiscal requis").optional(),
  rna: z.string().min(3, "Numéro d'enregistrement RNA requis").optional(),
  emailContact: z.string().email("Email de contact invalide").optional(),
  emailNotifications: z.string().email("Email de notification invalide").optional(),
  telephone: z.string().min(6, "Numéro de téléphone requis").optional(),
  telephoneUrgence: z.string().nullable().optional(),
  adresse: z.string().min(3, "Adresse requise").optional(),
  ville: z.string().min(2, "Ville requise").optional(),
  gouvernorat: z.string().min(2, "Gouvernorat requis").optional(),
  codePostal: z.string().min(4, "Code postal requis").optional(),
  siteWeb: z.string().url("URL du site web invalide").or(z.literal("")).optional(),
  ribBancaire: z.string().min(10, "Format de RIB bancaire requis").optional(),
  banqueNom: z.string().min(2, "Nom de la banque requis").optional(),
  facebook: z.string().nullable().optional(),
  instagram: z.string().nullable().optional(),
  linkedin: z.string().nullable().optional(),

  // Notifications
  notifNouvelleInscription: z.boolean().optional(),
  notifNouveauMessage: z.boolean().optional(),
  notifRappelEvenement: z.boolean().optional(),
  notifSeuilBeneficiaires: z.boolean().optional(),
  emailDigestHebdomadaire: z.boolean().optional(),

  // Permissions
  moderatorCanValidateBeneficiaires: z.boolean().optional(),
  moderatorCanPublishEvents: z.boolean().optional(),
  moderatorCanExportData: z.boolean().optional(),
});

export const createUserSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(8, "Le mot de passe doit comporter au moins 8 caractères"),
  firstName: z.string().min(2, "Le prénom doit comporter au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  role: z.enum(["ADMIN", "MODERATOR"]).default("MODERATOR"),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  role: z.enum(["ADMIN", "MODERATOR"]).optional(),
  isActive: z.boolean().optional(),
});
