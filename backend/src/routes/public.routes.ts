import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  getPublicEvenements,
  getPublicEvenementById,
  inscrireEvenement,
  getPublicStats,
  envoyerContact,
} from "../controllers/public.controller";

const router = Router();

/** Anti-spam : limite les soumissions de formulaires publics (inscription / contact) */
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Trop de soumissions. Veuillez réessayer dans quelques minutes.",
  },
});

// Lecture (vitrine)
router.get("/stats", getPublicStats);
router.get("/evenements", getPublicEvenements);
router.get("/evenements/:id", getPublicEvenementById);

// Formulaires publics
router.post("/evenements/:id/inscriptions", formLimiter, inscrireEvenement);
router.post("/contact", formLimiter, envoyerContact);

export default router;
