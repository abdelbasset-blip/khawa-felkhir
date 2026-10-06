import { apiClient } from "../lib/api-client";
import {
  AssociationSettings,
  TeamUser,
  CreateUserData,
  UpdateUserData,
} from "../types/settings";

export const getSettings = async (): Promise<AssociationSettings> => {
  const response = await apiClient.get<{ success: boolean; data: AssociationSettings }>("/settings");
  return response.data.data;
};

export const updateSettings = async (
  data: Partial<AssociationSettings>
): Promise<AssociationSettings> => {
  const response = await apiClient.put<{ success: boolean; data: AssociationSettings; message: string }>(
    "/settings",
    data
  );
  return response.data.data;
};

export const getTeamUsers = async (): Promise<TeamUser[]> => {
  const response = await apiClient.get<{ success: boolean; data: TeamUser[] }>("/settings/users");
  return response.data.data;
};

export const createTeamUser = async (data: CreateUserData): Promise<TeamUser> => {
  const response = await apiClient.post<{ success: boolean; data: TeamUser; message: string }>(
    "/settings/users",
    data
  );
  return response.data.data;
};

export const updateTeamUser = async (
  id: string,
  data: UpdateUserData
): Promise<TeamUser> => {
  const response = await apiClient.patch<{ success: boolean; data: TeamUser; message: string }>(
    `/settings/users/${id}`,
    data
  );
  return response.data.data;
};

export const deleteTeamUser = async (id: string): Promise<void> => {
  await apiClient.delete<{ success: boolean; message: string }>(`/settings/users/${id}`);
};
