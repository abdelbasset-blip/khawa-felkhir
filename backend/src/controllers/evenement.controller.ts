import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import {
  createEvenementSchema,
  updateEvenementSchema,
  queryEvenementsSchema,
} from "../validators/evenement.validator";
import { Prisma, TypeEvenement, StatutEvenement } from "@prisma/client";
import { buildShareLinks } from "../utils/shareLinks";

/**
 * 1. Liste paginée des événements avec recherche et filtres
 */
export const getEvenements = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = queryEvenementsSchema.parse(req.query);
    const { page, limit, search, type, statut, sortBy, sortOrder } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.EvenementWhereInput = {};

    if (search && search.trim() !== "") {
      const s = search.trim();
      where.OR = [
        { titre: { contains: s, mode: "insensitive" } },
        { lieu: { contains: s, mode: "insensitive" } },
        { description: { contains: s, mode: "insensitive" } },
      ];
    }

    if (type) where.type = type as TypeEvenement;
    if (statut) where.statut = statut as StatutEvenement;

    const [total, items] = await Promise.all([
      prisma.evenement.count({ where }),
      prisma.evenement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: {
        items,
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 2. Détail d'un événement par ID
 */
export const getEvenementById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const evenement = await prisma.evenement.findUnique({
      where: { id },
    });

    if (!evenement) {
      res.status(404).json({
        success: false,
        message: "Événement introuvable",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: evenement,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 3. Création d'un événement
 */
export const createEvenement = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = createEvenementSchema.parse(req.body);

    const evenement = await prisma.evenement.create({
      data: {
        titre: data.titre,
        description: data.description,
        type: data.type as TypeEvenement,
        dateDebut: data.dateDebut,
        dateFin: data.dateFin,
        lieu: data.lieu,
        capaciteMax: data.capaciteMax || null,
        imageCouverture: data.imageCouverture || null,
        galerie: data.galerie || [],
        budget: data.budget || 0,
        statut: data.statut as StatutEvenement,
        organisateurId: req.user?.userId || data.organisateurId || null,
      },
    });

    res.status(201).json({
      success: true,
      message: "Événement créé avec succès",
      data: evenement,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 4. Mise à jour d'un événement
 */
export const updateEvenement = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = updateEvenementSchema.parse(req.body);

    const existing = await prisma.evenement.findUnique({
      where: { id },
    });

    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Événement introuvable",
      });
      return;
    }

    const updated = await prisma.evenement.update({
      where: { id },
      data: {
        ...(data.titre && { titre: data.titre }),
        ...(data.description && { description: data.description }),
        ...(data.type && { type: data.type as TypeEvenement }),
        ...(data.dateDebut && { dateDebut: data.dateDebut }),
        ...(data.dateFin && { dateFin: data.dateFin }),
        ...(data.lieu && { lieu: data.lieu }),
        ...(data.capaciteMax !== undefined && { capaciteMax: data.capaciteMax }),
        ...(data.imageCouverture !== undefined && { imageCouverture: data.imageCouverture }),
        ...(data.galerie && { galerie: data.galerie }),
        ...(data.budget !== undefined && { budget: data.budget }),
        ...(data.statut && { statut: data.statut as StatutEvenement }),
      },
    });

    res.status(200).json({
      success: true,
      message: "Événement mis à jour avec succès",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 5. Suppression d'un événement
 */
export const deleteEvenement = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.evenement.findUnique({
      where: { id },
    });

    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Événement introuvable",
      });
      return;
    }

    await prisma.evenement.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Événement supprimé avec succès",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 6. Publication et Génération des liens de partage social
 * POST /api/v1/evenements/:id/publier
 */
export const publierEvenement = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.evenement.findUnique({
      where: { id },
    });

    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Événement introuvable",
      });
      return;
    }

    const updated = await prisma.evenement.update({
      where: { id },
      data: {
        statut: StatutEvenement.publie,
      },
    });

    // Génération des URLs de partage sur les réseaux sociaux (utilitaire partagé)
    const shareLinks = buildShareLinks(updated);

    res.status(200).json({
      success: true,
      message: "Événement publié avec succès",
      data: {
        evenement: updated,
        shareLinks,
      },
    });
  } catch (error) {
    next(error);
  }
};
