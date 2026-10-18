import type { User } from "../../domain/user/entity.js";

export interface RegisterData {
  email: string;
  name: string;
  password: string;
}

export interface UserService {
  getUserByEmail(email: string): Promise<User | null>;
  registerUser(data: RegisterData): Promise<User>;
}