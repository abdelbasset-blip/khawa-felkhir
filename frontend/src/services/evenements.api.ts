import { apiClient } from "../lib/api-client";
import {
  Evenement,
  EvenementsQuery,
  EvenementsPaginatedResponse,
  EvenementMutationResponse,
  PublierEvenementResponse,
} from "../types/evenement";

export const getEvenements = async (
  params?: EvenementsQuery
): Promise<EvenementsPaginatedResponse["data"]> => {
  const response = await apiClient.get<EvenementsPaginatedResponse>(
    "/evenements",
    { params }
  );
  return response.data.data;
};

export const getEvenementById = async (id: string): Promise<Evenement> => {
  const response = await apiClient.get<{ success: boolean; data: Evenement }>(
    `/evenements/${id}`
  );
  return response.data.data;
};

export const createEvenement = async (
  data: Partial<Evenement>
): Promise<Evenement> => {
  const response = await apiClient.post<EvenementMutationResponse>(
    "/evenements",
    data
  );
  if (!response.data.data) {
    throw new Error(response.data.message || "Erreur lors de la création");
  }
  return response.data.data;
};

export const updateEvenement = async (
  id: string,
  data: Partial<Evenement>
): Promise<Evenement> => {
  const response = await apiClient.put<EvenementMutationResponse>(
    `/evenements/${id}`,
    data
  );
  if (!response.data.data) {
    throw new Error(response.data.message || "Erreur lors de la modification");
  }
  return response.data.data;
};

export const deleteEvenement = async (id: string): Promise<void> => {
  await apiClient.delete(`/evenements/${id}`);
};

/**
 * Publication et génération des URLs de partage social
 */
export const publierEvenement = async (
  id: string
): Promise<PublierEvenementResponse["data"]> => {
  const response = await apiClient.post<PublierEvenementResponse>(
    `/evenements/${id}/publier`
  );
  return response.data.data;
};
