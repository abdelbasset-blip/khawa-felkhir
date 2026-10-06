import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import {
  publicEvenementsQuerySchema,
  inscriptionSchema,
  contactSchema,
} from "../validators/public.validator";
import { buildShareLinks } from "../utils/shareLinks";

/**
 * Contrôleur de la VITRINE PUBLIQUE (aucune authentification).
 * Règle de sécurité : seuls les événements "publie" ou "termine" sont exposés,
 * jamais les brouillons, et les champs internes (organisateurId, budget détaillé) sont masqués.
 */

const STATUTS_PUBLICS: Prisma.EvenementWhereInput["statut"] = {
  in: ["publie", "termine"],
};

/** Champs exposés publiquement + nombre d'inscrits (pour la barre de progression des places) */
const publicSelect = {
  id: true,
  titre: true,
  description: true,
  type: true,
  dateDebut: true,
  dateFin: true,
  lieu: true,
  capaciteMax: true,
  imageCouverture: true,
  galerie: true,
  statut: true,
  _count: { select: { inscriptions: true } },
} satisfies Prisma.EvenementSelect;

type PublicEvenementRow = Prisma.EvenementGetPayload<{ select: typeof publicSelect }>;

/** Aplatit `_count` en `placesPrises` pour un contrat d'API plus lisible */
const toPublicDto = ({ _count, ...evt }: PublicEvenementRow) => ({
  ...evt,
  placesPrises: _count.inscriptions,
});

/**
 * GET /api/v1/public/evenements
 * Filtres : periode (a_venir | en_cours | passes), type, search, dateFrom, dateTo
 */
export const getPublicEvenements = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit, periode, type, search, dateFrom, dateTo } =
      publicEvenementsQuerySchema.parse(req.query);
    const now = new Date();

    const and: Prisma.EvenementWhereInput[] = [{ statut: STATUTS_PUBLICS }];

    if (periode === "a_venir") and.push({ dateDebut: { gt: now } });
    if (periode === "en_cours") and.push({ dateDebut: { lte: now }, dateFin: { gte: now } });
    if (periode === "passes") and.push({ dateFin: { lt: now } });

    if (type) and.push({ type });
    if (dateFrom) and.push({ dateDebut: { gte: dateFrom } });
    if (dateTo) and.push({ dateDebut: { lte: dateTo } });

    if (search) {
      and.push({
        OR: [
          { titre: { contains: search, mode: "insensitive" } },
          { lieu: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    const where: Prisma.EvenementWhereInput = { AND: and };

    const [total, rows] = await Promise.all([
      prisma.evenement.count({ where }),
      prisma.evenement.findMany({
        where,
        select: publicSelect,
        skip: (page - 1) * limit,
        take: limit,
        // Les événements passés sont affichés du plus récent au plus ancien
        orderBy: { dateDebut: periode === "passes" ? "desc" : "asc" },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        items: rows.map(toPublicDto),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/public/evenements/:id
 * Détail + liens de partage + 3 événements similaires (même type en priorité)
 */
export const getPublicEvenementById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const row = await prisma.evenement.findFirst({
      where: { id, statut: STATUTS_PUBLICS },
      select: publicSelect,
    });

    if (!row) {
      res.status(404).json({ success: false, message: "Événement introuvable" });
      return;
    }

    // Événements similaires : même type d'abord, complétés par d'autres actions publiques
    const sameType = await prisma.evenement.findMany({
      where: { statut: STATUTS_PUBLICS, type: row.type, id: { not: id } },
      select: publicSelect,
      orderBy: { dateDebut: "desc" },
      take: 3,
    });

    let similaires = sameType;
    if (similaires.length < 3) {
      const others = await prisma.evenement.findMany({
        where: {
          statut: STATUTS_PUBLICS,
          id: { notIn: [id, ...sameType.map((e) => e.id)] },
        },
        select: publicSelect,
        orderBy: { dateDebut: "desc" },
        take: 3 - similaires.length,
      });
      similaires = [...similaires, ...others];
    }

    res.status(200).json({
      success: true,
      data: {
        evenement: toPublicDto(row),
        shareLinks: buildShareLinks(row),
        similaires: similaires.map(toPublicDto),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/public/evenements/:id/inscriptions
 * Inscription d'un bénévole / participant (contrôle de capacité + doublon email)
 */
export const inscrireEvenement = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = inscriptionSchema.parse(req.body);

    const evt = await prisma.evenement.findFirst({
      where: { id, statut: "publie" },
      select: { id: true, dateFin: true, capaciteMax: true, _count: { select: { inscriptions: true } } },
    });

    if (!evt) {
      res.status(404).json({ success: false, message: "Événement introuvable ou non ouvert aux inscriptions" });
      return;
    }

    if (evt.dateFin < new Date()) {
      res.status(400).json({ success: false, message: "Cet événement est terminé" });
      return;
    }

    if (evt.capaciteMax && evt._count.inscriptions >= evt.capaciteMax) {
      res.status(409).json({ success: false, message: "Désolé, toutes les places sont prises" });
      return;
    }

    try {
      await prisma.inscription.create({
        data: {
          evenementId: id,
          nom: data.nom,
          email: data.email,
          telephone: data.telephone || null,
          message: data.message || null,
        },
      });
    } catch (err) {
      // Contrainte unique (evenementId, email)
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        res.status(409).json({ success: false, message: "Vous êtes déjà inscrit(e) à cet événement" });
        return;
      }
      throw err;
    }

    res.status(201).json({
      success: true,
      message: "Inscription confirmée, merci pour votre engagement !",
      data: { placesPrises: evt._count.inscriptions + 1 },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/public/stats
 * Compteurs d'impact affichés sur la page d'accueil
 */
export const getPublicStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [familles, beneficiairesAides, actions, benevoles, villes] = await Promise.all([
      prisma.beneficiaire.count(),
      prisma.beneficiaire.count({ where: { statut: "aide" } }),
      prisma.evenement.count({ where: { statut: STATUTS_PUBLICS } }),
      prisma.inscription.count(),
      prisma.beneficiaire.findMany({ distinct: ["ville"], select: { ville: true } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        familles,
        beneficiairesAides,
        actions,
        benevoles,
        villes: villes.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/public/contact
 */
export const envoyerContact = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = contactSchema.parse(req.body);

    await prisma.contactMessage.create({
      data: { ...data, telephone: data.telephone || null },
    });

    res.status(201).json({
      success: true,
      message: "Votre message a bien été envoyé. Nous vous répondrons rapidement.",
    });
  } catch (error) {
    next(error);
  }
};
