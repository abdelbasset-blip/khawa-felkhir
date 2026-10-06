import { Router } from "express";
import {
  getSettings,
  updateSettings,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/settings.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// Toutes les routes de configuration requièrent une authentification
router.use(requireAuth);

// Paramètres généraux (coordonnées, notifications, règles)
router.get("/", getSettings);
router.put("/", updateSettings);

// Gestion de l'équipe et des permissions
router.get("/users", getUsers);
router.post("/users", createUser);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
