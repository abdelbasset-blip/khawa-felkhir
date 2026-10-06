export type TypeAide =
  | "alimentaire"
  | "medical"
  | "scolaire"
  | "vestimentaire"
  | "financier"
  | "autre";

export type StatutBeneficiaire = "en_attente" | "valide" | "aide";

export interface Beneficiaire {
  id: string;
  nom: string;
  prenom: string;
  cin: string;
  telephone: string;
  adresse: string;
  ville: string;
  situationFamiliale: string;
  nbEnfants: number;
  typeAide: TypeAide;
  statut: StatutBeneficiaire;
  notes?: string | null;
  dateAjout: string;
  documents: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BeneficiairesQuery {
  page?: number;
  limit?: number;
  search?: string;
  type_aide?: TypeAide;
  statut?: StatutBeneficiaire;
  sortBy?: "nom" | "prenom" | "dateAjout" | "statut" | "nbEnfants";
  sortOrder?: "asc" | "desc";
}

export interface BeneficiairesPaginatedResponse {
  success: boolean;
  data: {
    items: Beneficiaire[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface BeneficiaireMutationResponse {
  success: boolean;
  message?: string;
  data?: Beneficiaire;
}
