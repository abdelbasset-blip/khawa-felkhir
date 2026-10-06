import { apiClient } from "../lib/api-client";
import type {
  PublicEvenementsQuery,
  PaginatedPublicEvenements,
  PublicEvenementDetail,
  PublicStats,
  InscriptionPayload,
  ContactPayload,
} from "../types/public";

/** Services de la vitrine publique — endpoints /api/v1/public (sans authentification) */

interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const getPublicEvenements = async (
  params?: PublicEvenementsQuery
): Promise<PaginatedPublicEvenements> => {
  const res = await apiClient.get<ApiEnvelope<PaginatedPublicEvenements>>("/public/evenements", {
    params,
  });
  return res.data.data;
};

export const getPublicEvenementById = async (id: string): Promise<PublicEvenementDetail> => {
  const res = await apiClient.get<ApiEnvelope<PublicEvenementDetail>>(`/public/evenements/${id}`);
  return res.data.data;
};

export const getPublicStats = async (): Promise<PublicStats> => {
  const res = await apiClient.get<ApiEnvelope<PublicStats>>("/public/stats");
  return res.data.data;
};

export const inscrireEvenement = async (
  id: string,
  payload: InscriptionPayload
): Promise<{ message: string; placesPrises: number }> => {
  const res = await apiClient.post<ApiEnvelope<{ placesPrises: number }>>(
    `/public/evenements/${id}/inscriptions`,
    payload
  );
  return { message: res.data.message ?? "Inscription confirmée", placesPrises: res.data.data.placesPrises };
};

export const envoyerContact = async (payload: ContactPayload): Promise<string> => {
  const res = await apiClient.post<ApiEnvelope<null>>("/public/contact", payload);
  return res.data.message ?? "Message envoyé";
};

/** Extrait un message d'erreur lisible depuis une erreur Axios */
export const getApiErrorMessage = (err: unknown, fallback = "Une erreur est survenue"): string => {
  const e = err as { response?: { data?: { message?: string } }; message?: string };
  return e.response?.data?.message || e.message || fallback;
};
