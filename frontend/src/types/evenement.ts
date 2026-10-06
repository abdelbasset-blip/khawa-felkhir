export type TypeEvenement =
  | "distribution_alimentaire"
  | "collecte_dons"
  | "soutien_scolaire"
  | "aide_medicale"
  | "distribution_vetements"
  | "evenement_religieux"
  | "autre";

export type StatutEvenement = "brouillon" | "publie" | "termine";

export interface Evenement {
  id: string;
  titre: string;
  description: string;
  type: TypeEvenement;
  dateDebut: string;
  dateFin: string;
  lieu: string;
  capaciteMax?: number | null;
  imageCouverture?: string | null;
  galerie?: string[];
  budget: number;
  statut: StatutEvenement;
  organisateurId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShareLinks {
  shareUrl: string;
  facebook: string;
  twitter: string;
  whatsapp: string;
  telegram: string;
}

export interface EvenementsQuery {
  page?: number;
  limit?: number;
  search?: string;
  type?: TypeEvenement;
  statut?: StatutEvenement;
  sortBy?: "titre" | "dateDebut" | "dateFin" | "budget" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface EvenementsPaginatedResponse {
  success: boolean;
  data: {
    items: Evenement[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface EvenementMutationResponse {
  success: boolean;
  message?: string;
  data?: Evenement;
}

export interface PublierEvenementResponse {
  success: boolean;
  message?: string;
  data: {
    evenement: Evenement;
    shareLinks: ShareLinks;
  };
}
