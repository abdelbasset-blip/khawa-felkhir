import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "L'adresse email est requise" })
    .email("Format d'email invalide")
    .trim()
    .toLowerCase(),
  password: z
    .string({ required_error: "Le mot de passe est requis" })
    .min(6, "Le mot de passe doit comporter au moins 6 caractères"),
});

export type LoginInput = z.infer<typeof loginSchema>;
