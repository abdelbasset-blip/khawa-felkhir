import { apiClient } from "../lib/api-client";
import {
  Beneficiaire,
  BeneficiairesQuery,
  BeneficiairesPaginatedResponse,
  BeneficiaireMutationResponse,
} from "../types/beneficiaire";

export const getBeneficiaires = async (
  params?: BeneficiairesQuery
): Promise<BeneficiairesPaginatedResponse["data"]> => {
  const response = await apiClient.get<BeneficiairesPaginatedResponse>(
    "/beneficiaires",
    { params }
  );
  return response.data.data;
};

export const getBeneficiaireById = async (id: string): Promise<Beneficiaire> => {
  const response = await apiClient.get<{ success: boolean; data: Beneficiaire }>(
    `/beneficiaires/${id}`
  );
  return response.data.data;
};

export const createBeneficiaire = async (
  data: Partial<Beneficiaire>
): Promise<Beneficiaire> => {
  const response = await apiClient.post<BeneficiaireMutationResponse>(
    "/beneficiaires",
    data
  );
  if (!response.data.data) {
    throw new Error(response.data.message || "Erreur lors de la création");
  }
  return response.data.data;
};

export const updateBeneficiaire = async (
  id: string,
  data: Partial<Beneficiaire>
): Promise<Beneficiaire> => {
  const response = await apiClient.put<BeneficiaireMutationResponse>(
    `/beneficiaires/${id}`,
    data
  );
  if (!response.data.data) {
    throw new Error(response.data.message || "Erreur lors de la modification");
  }
  return response.data.data;
};

export const deleteBeneficiaire = async (id: string): Promise<void> => {
  await apiClient.delete(`/beneficiaires/${id}`);
};

/**
 * Téléchargement du fichier CSV d'export
 */
export const downloadBeneficiairesCsv = async (
  params?: BeneficiairesQuery
): Promise<void> => {
  const response = await apiClient.get("/beneficiaires/export/csv", {
    params,
    responseType: "blob",
  });

  const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    `beneficiaires_khawa_${new Date().toISOString().split("T")[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
