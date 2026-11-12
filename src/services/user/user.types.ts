import type { User } from "../../domain/user/entity.js";

export type PublicUser = Omit<User, "passwordHash">;

export interface RegisterData {
  email: string;
  name: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResult {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
}

export interface PasswordHasherContract {
  hashPassword(password: string): Promise<string>;
  verifyPassword(password: string, hash: string): Promise<boolean>;
}

export interface TokenSignerContract {
  signAccessToken(userId: number): string;
  signRefreshToken(userId: number): string;
}

export interface TokenVerifierContract {
  verifyAccessToken(token: string): number;
  verifyRefreshToken(token: string): number;
}

export interface UserService {
  register(data: RegisterData): Promise<PublicUser>;
  login(input: LoginData): Promise<LoginResult>;
  refresh(refreshToken: string): Promise<UserTokens>;
  me(id: number): Promise<PublicUser>;
}