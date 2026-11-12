import type { User } from "../../../domain/user/entity";

export interface UserResponse {
  id: number;
  email: string;
  name: string;
}

export interface LoginResponse {
  user: Omit<User, "passwordHash">;
  accessToken: string;
  refreshToken: string;
}