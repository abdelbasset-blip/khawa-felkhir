import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";
import beneficiaireRoutes from "./routes/beneficiaire.routes";
import evenementRoutes from "./routes/evenement.routes";
import publicRoutes from "./routes/public.routes";
import settingsRoutes from "./routes/settings.routes";
import { errorHandler } from "./middlewares/error.middleware";

export const createApp = (): Application => {
  const app = express();

  // 1. Sécurité HTTP & Headers
  app.use(helmet());

  // 2. Gestion des origines autorisées (CORS) avec credentials pour les cookies HttpOnly
  const allowedOrigins = [
    env.CLIENT_URL,
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Autoriser les requêtes sans origine (comme curl ou applications mobiles) ou dans la liste blanche
        if (!origin || allowedOrigins.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Bloqué par la politique CORS"));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // 3. Rate limiting pour protéger les endpoints d'authentification
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limite à 50 requêtes par fenêtre par IP
    message: {
      success: false,
      message: "Trop de tentatives de requêtes. Veuillez patienter 15 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // 4. Parsers JSON et cookies
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // 5. Route de health-check
  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // 6. Enregistrement des routes API
  app.use("/api/v1/auth", authLimiter, authRoutes);
  app.use("/api/v1/beneficiaires", beneficiaireRoutes);
  app.use("/api/v1/evenements", evenementRoutes);
  app.use("/api/v1/public", publicRoutes); // Vitrine publique (Phase 5)
  app.use("/api/v1/settings", settingsRoutes); // Paramètres de l'association (Phase 6+)

  // 7. Middleware de gestion centralisée des erreurs
  app.use(errorHandler);

  return app;
};
