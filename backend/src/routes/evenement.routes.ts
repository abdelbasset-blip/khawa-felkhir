import { Router } from "express";
import {
  getEvenements,
  getEvenementById,
  createEvenement,
  updateEvenement,
  deleteEvenement,
  publierEvenement,
} from "../controllers/evenement.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// Lecture des événements
router.get("/", getEvenements);
router.get("/:id", getEvenementById);

// Opérations de gestion réservées aux administrateurs
router.post("/", requireAuth, createEvenement);
router.put("/:id", requireAuth, updateEvenement);
router.delete("/:id", requireAuth, deleteEvenement);
router.post("/:id/publier", requireAuth, publierEvenement);

export default router;
