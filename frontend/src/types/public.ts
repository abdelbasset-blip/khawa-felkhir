import type { Evenement, ShareLinks as AdminShareLinks } from "./evenement";

/** Onglets de la page publique /evenements */
export type Periode = "a_venir" | "en_cours" | "passes";

/** Événement tel qu'exposé par l'API publique (sans budget ni organisateur) */
export type PublicEvenement = Omit<Evenement, "budget" | "organisateurId" | "createdAt" | "updatedAt"> & {
  placesPrises: number;
};

/** Les liens publics incluent LinkedIn en plus des réseaux de l'admin */
export type PublicShareLinks = AdminShareLinks & { linkedin: string };

export interface PublicEvenementsQuery {
  page?: number;
  limit?: number;
  periode?: Periode;
  type?: Evenement["type"];
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface PaginatedPublicEvenements {
  items: PublicEvenement[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PublicEvenementDetail {
  evenement: PublicEvenement;
  shareLinks: PublicShareLinks;
  similaires: PublicEvenement[];
}

export interface PublicStats {
  familles: number;
  beneficiairesAides: number;
  actions: number;
  benevoles: number;
  villes: number;
}

export interface InscriptionPayload {
  nom: string;
  email: string;
  telephone?: string;
  message?: string;
}

export interface ContactPayload {
  nom: string;
  email: string;
  telephone?: string;
  sujet: string;
  message: string;
}
