import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import {
  createBeneficiaireSchema,
  updateBeneficiaireSchema,
  queryBeneficiairesSchema,
  TypeAide,
  StatutBeneficiaire,
} from "../validators/beneficiaire.validator";
import { Prisma } from "@prisma/client";

/**
 * 1. Liste paginée avec recherche et filtres
 */
export const getBeneficiaires = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = queryBeneficiairesSchema.parse(req.query);
    const { page, limit, search, type_aide, statut, sortBy, sortOrder } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.BeneficiaireWhereInput = {};

    // Filtre de recherche textuelle globale (insensible à la casse)
    if (search && search.trim() !== "") {
      const s = search.trim();
      where.OR = [
        { nom: { contains: s, mode: "insensitive" } },
        { prenom: { contains: s, mode: "insensitive" } },
        { cin: { contains: s, mode: "insensitive" } },
        { telephone: { contains: s, mode: "insensitive" } },
        { ville: { contains: s, mode: "insensitive" } },
      ];
    }

    if (type_aide) {
      where.typeAide = type_aide as TypeAide;
    }

    if (statut) {
      where.statut = statut as StatutBeneficiaire;
    }

    const [total, items] = await Promise.all([
      prisma.beneficiaire.count({ where }),
      prisma.beneficiaire.findMany({
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
 * 2. Détail d'un bénéficiaire par son ID
 */
export const getBeneficiaireById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const beneficiaire = await prisma.beneficiaire.findUnique({
      where: { id },
    });

    if (!beneficiaire) {
      res.status(404).json({
        success: false,
        message: "Bénéficiaire introuvable",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: beneficiaire,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 3. Création d'un nouveau bénéficiaire
 */
export const createBeneficiaire = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = createBeneficiaireSchema.parse(req.body);

    // Vérification de l'unicité du CIN
    const existing = await prisma.beneficiaire.findUnique({
      where: { cin: data.cin },
    });

    if (existing) {
      res.status(409).json({
        success: false,
        message: `Un bénéficiaire avec le numéro CIN ${data.cin} est déjà enregistré.`,
      });
      return;
    }

    const beneficiaire = await prisma.beneficiaire.create({
      data: {
        nom: data.nom,
        prenom: data.prenom,
        cin: data.cin,
        telephone: data.telephone,
        adresse: data.adresse,
        ville: data.ville,
        situationFamiliale: data.situationFamiliale,
        nbEnfants: data.nbEnfants,
        typeAide: data.typeAide as TypeAide,
        statut: data.statut as StatutBeneficiaire,
        notes: data.notes || null,
        documents: data.documents,
      },
    });

    res.status(201).json({
      success: true,
      message: "Bénéficiaire enregistré avec succès",
      data: beneficiaire,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 4. Mise à jour d'un bénéficiaire
 */
export const updateBeneficiaire = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = updateBeneficiaireSchema.parse(req.body);

    const existing = await prisma.beneficiaire.findUnique({
      where: { id },
    });

    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Bénéficiaire introuvable",
      });
      return;
    }

    // Si le CIN est modifié, vérifier qu'il n'est pas utilisé par un autre dossier
    if (data.cin && data.cin !== existing.cin) {
      const duplicate = await prisma.beneficiaire.findUnique({
        where: { cin: data.cin },
      });
      if (duplicate) {
        res.status(409).json({
          success: false,
          message: `Le numéro CIN ${data.cin} est déjà attribué à un autre bénéficiaire.`,
        });
        return;
      }
    }

    const updated = await prisma.beneficiaire.update({
      where: { id },
      data: {
        ...(data.nom && { nom: data.nom }),
        ...(data.prenom && { prenom: data.prenom }),
        ...(data.cin && { cin: data.cin }),
        ...(data.telephone && { telephone: data.telephone }),
        ...(data.adresse && { adresse: data.adresse }),
        ...(data.ville && { ville: data.ville }),
        ...(data.situationFamiliale && { situationFamiliale: data.situationFamiliale }),
        ...(data.nbEnfants !== undefined && { nbEnfants: data.nbEnfants }),
        ...(data.typeAide && { typeAide: data.typeAide as TypeAide }),
        ...(data.statut && { statut: data.statut as StatutBeneficiaire }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.documents && { documents: data.documents }),
      },
    });

    res.status(200).json({
      success: true,
      message: "Fiche bénéficiaire mise à jour",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 5. Suppression d'un bénéficiaire
 */
export const deleteBeneficiaire = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.beneficiaire.findUnique({
      where: { id },
    });

    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Bénéficiaire introuvable",
      });
      return;
    }

    await prisma.beneficiaire.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Bénéficiaire supprimé avec succès",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 6. Exportation des bénéficiaires au format CSV (compatible Excel avec BOM UTF-8)
 */
export const exportCsv = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = queryBeneficiairesSchema.parse(req.query);
    const { search, type_aide, statut } = query;

    const where: Prisma.BeneficiaireWhereInput = {};

    if (search && search.trim() !== "") {
      const s = search.trim();
      where.OR = [
        { nom: { contains: s, mode: "insensitive" } },
        { prenom: { contains: s, mode: "insensitive" } },
        { cin: { contains: s, mode: "insensitive" } },
        { telephone: { contains: s, mode: "insensitive" } },
        { ville: { contains: s, mode: "insensitive" } },
      ];
    }

    if (type_aide) where.typeAide = type_aide as TypeAide;
    if (statut) where.statut = statut as StatutBeneficiaire;

    const beneficiaires = await prisma.beneficiaire.findMany({
      where,
      orderBy: { dateAjout: "desc" },
    });

    const headers = [
      "ID",
      "Nom",
      "Prénom",
      "CIN",
      "Téléphone",
      "Ville",
      "Adresse",
      "Situation Familiale",
      "Nombre d'enfants",
      "Type d'aide",
      "Statut",
      "Date d'inscription",
      "Notes",
    ];

    const escapeCsv = (str: string | number | null | undefined): string => {
      if (str === null || str === undefined) return '""';
      const formatted = String(str).replace(/"/g, '""');
      return `"${formatted}"`;
    };

    const rows = beneficiaires.map((b) => [
      escapeCsv(b.id),
      escapeCsv(b.nom),
      escapeCsv(b.prenom),
      escapeCsv(b.cin),
      escapeCsv(b.telephone),
      escapeCsv(b.ville),
      escapeCsv(b.adresse),
      escapeCsv(b.situationFamiliale),
      escapeCsv(b.nbEnfants),
      escapeCsv(b.typeAide),
      escapeCsv(b.statut),
      escapeCsv(b.dateAjout.toISOString().split("T")[0]),
      escapeCsv(b.notes || ""),
    ]);

    // Ajout du BOM UTF-8 (\uFEFF) pour garantir le bon affichage des accents dans Excel
    const csvContent =
      "\uFEFF" +
      [headers.join(";"), ...rows.map((row) => row.join(";"))].join("\r\n");

    const filename = `beneficiaires_khawa_felkhir_${new Date().toISOString().split("T")[0]}.csv`;

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};
