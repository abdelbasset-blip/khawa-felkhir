export type UserRole = "ADMIN" | "MODERATOR";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    accessToken: string;
    user: User;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}
