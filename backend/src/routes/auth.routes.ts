import { Router } from "express";
import { login, logout, getMe, refreshToken } from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// Routes publiques
router.post("/login", login);
router.post("/refresh", refreshToken);

// Routes protégées par JWT
router.post("/logout", requireAuth, logout);
router.get("/me", requireAuth, getMe);

export default router;
