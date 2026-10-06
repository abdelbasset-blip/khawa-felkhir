import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, TokenPayload } from "../utils/token.utils";
import { prisma } from "../config/prisma";

// Extension de l'interface Request Express pour typer req.user
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Accès non autorisé : Token manquant ou mal formaté",
      });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    // Vérifier si l'utilisateur existe toujours et est actif
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: "Compte introuvable ou désactivé",
      });
      return;
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Session expirée ou token invalide",
    });
  }
};
