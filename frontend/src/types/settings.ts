export interface AssociationSettings {
  id: string;
  nom: string;
  sigle: string;
  description: string;
  matriculeFiscal: string;
  rna: string;
  emailContact: string;
  emailNotifications: string;
  telephone: string;
  telephoneUrgence?: string | null;
  adresse: string;
  ville: string;
  gouvernorat: string;
  codePostal: string;
  siteWeb: string;
  ribBancaire: string;
  banqueNom: string;
  facebook?: string | null;
  instagram?: string | null;
  linkedin?: string | null;

  // Notifications
  notifNouvelleInscription: boolean;
  notifNouveauMessage: boolean;
  notifRappelEvenement: boolean;
  notifSeuilBeneficiaires: boolean;
  emailDigestHebdomadaire: boolean;

  // Permissions globales modérateurs
  moderatorCanValidateBeneficiaires: boolean;
  moderatorCanPublishEvents: boolean;
  moderatorCanExportData: boolean;

  updatedAt: string;
}

export type Role = "ADMIN" | "MODERATOR";

export interface TeamUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  role?: Role;
  isActive?: boolean;
}
