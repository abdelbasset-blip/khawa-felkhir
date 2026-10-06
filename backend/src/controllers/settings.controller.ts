import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";
import {
  updateSettingsSchema,
  createUserSchema,
  updateUserSchema,
} from "../validators/settings.validator";

/**
 * Récupérer les paramètres de l'association
 * GET /api/v1/settings
 */
export const getSettings = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Récupération de l'enregistrement unique des paramètres
    let settings = await prisma.associationSetting.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      settings = await prisma.associationSetting.create({
        data: { id: "default" },
      });
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour les paramètres de l'association (Coordonnées, Notifications, Règles)
 * PUT /api/v1/settings
 */
export const updateSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = updateSettingsSchema.parse(req.body);

    const updated = await prisma.associationSetting.upsert({
      where: { id: "default" },
      update: validatedData,
      create: {
        id: "default",
        ...validatedData,
      },
    });

    res.status(200).json({
      success: true,
      message: "Paramètres de l'association mis à jour avec succès",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Liste des utilisateurs / membres de l'équipe
 * GET /api/v1/settings/users
 */
export const getUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Ajouter un nouvel utilisateur / membre d'équipe
 * POST /api/v1/settings/users
 */
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, firstName, lastName, role } = createUserSchema.parse(req.body);

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      res.status(409).json({
        success: false,
        message: "Un compte avec cette adresse email existe déjà",
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        role,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Modifier le rôle ou le statut d'un utilisateur
 * PATCH /api/v1/settings/users/:id
 */
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = updateUserSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      res.status(404).json({
        success: false,
        message: "Utilisateur introuvable",
      });
      return;
    }

    // Protection : si on désactive ou change le rôle d'un ADMIN, vérifier qu'il reste au moins un ADMIN actif
    if (
      existingUser.role === "ADMIN" &&
      (validatedData.role === "MODERATOR" || validatedData.isActive === false)
    ) {
      const activeAdminsCount = await prisma.user.count({
        where: {
          role: "ADMIN",
          isActive: true,
          NOT: { id },
        },
      });

      if (activeAdminsCount === 0) {
        res.status(400).json({
          success: false,
          message: "Impossible de modifier ou désactiver le dernier administrateur actif du système",
        });
        return;
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data: validatedData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Utilisateur mis à jour avec succès",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer un utilisateur de l'équipe
 * DELETE /api/v1/settings/users/:id
 */
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.userId;

    if (id === currentUserId) {
      res.status(400).json({
        success: false,
        message: "Vous ne pouvez pas supprimer votre propre compte administrateur en cours d'utilisation",
      });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "Utilisateur introuvable",
      });
      return;
    }

    if (user.role === "ADMIN") {
      const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
      if (adminCount <= 1) {
        res.status(400).json({
          success: false,
          message: "Impossible de supprimer le dernier compte administrateur",
        });
        return;
      }
    }

    await prisma.user.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Utilisateur supprimé avec succès",
    });
  } catch (error) {
    next(error);
  }
};
