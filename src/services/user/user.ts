import type { UserRepository } from "../../domain/user/repository.js";
import type { UserService } from "./user.types.js";
import { hashPassword, verifyPassword } from "../../lib/password.js";

export function createUserService(userRepository: UserRepository): UserService {
  return {
    getUserByEmail(email) {
      return userRepository.getByEmail(email);
    },

    async registerUser(data) {
      const passwordHash = await hashPassword(data.password);

      return userRepository.addUser({
        email: data.email,
        name: data.name,
        passwordHash,
      });
    },

    async login(input) {
      const user = await userRepository.getByEmail(
        input.email.trim().toLowerCase()
      );

      if (!user) {
        throw new Error("Invalid email or password");
      }

      const isPasswordValid = await verifyPassword(
        input.password,
        user.passwordHash
      );

      if (!isPasswordValid) {
        throw new Error("Invalid email or password");
      }

      return String(user.id);
    },
  };
}