import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";
import { loginSchema } from "../validators/auth.validator";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  setRefreshCookie,
  clearRefreshCookie,
  REFRESH_COOKIE_NAME,
} from "../utils/token.utils";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. Validation Zod du payload
    const { email, password } = loginSchema.parse(req.body);

    // 2. Recherche de l'utilisateur admin
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Identifiants invalides (email ou mot de passe incorrect)",
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: "Ce compte a été suspendu. Veuillez contacter un administrateur.",
      });
      return;
    }

    // 3. Vérification du hash bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Identifiants invalides (email ou mot de passe incorrect)",
      });
      return;
    }

    // 4. Génération des tokens JWT
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    // 5. Stockage sécurisé du refresh token dans un cookie HttpOnly
    setRefreshCookie(res, refreshToken);

    // 6. Réponse avec l'access token et les informations de profil public
    res.status(200).json({
      success: true,
      message: "Connexion réussie",
      data: {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    clearRefreshCookie(res);
    res.status(200).json({
      success: true,
      message: "Déconnexion réussie",
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Non authentifié" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
      return;
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

    if (!rawRefreshToken) {
      res.status(401).json({
        success: false,
        message: "Refresh token absent",
      });
      return;
    }

    const decoded = verifyRefreshToken(rawRefreshToken);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || !user.isActive) {
      clearRefreshCookie(res);
      res.status(401).json({
        success: false,
        message: "Utilisateur inactif ou inexistant",
      });
      return;
    }

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const newAccessToken = signAccessToken(tokenPayload);
    const newRefreshToken = signRefreshToken(tokenPayload);

    setRefreshCookie(res, newRefreshToken);

    res.status(200).json({
      success: true,
      data: {
        accessToken: newAccessToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      },
    });
  } catch (error) {
    clearRefreshCookie(res);
    res.status(401).json({
      success: false,
      message: "Session expirée, veuillez vous reconnecter",
    });
  }
};
