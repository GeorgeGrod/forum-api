
import type { UserRepository } from "../../domain/user/repository.js";
import type { PasswordHasher, UserService } from "./user.types.js";

export function createUserService(userRepository: UserRepository, hasher: PasswordHasher): UserService {
  return {
    getUserByEmail(email) {
      return userRepository.getByEmail(email);
    },

    async registerUser(data) {
      const passwordHash = await hasher.hash(data.password);

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

      const isPasswordValid = await hasher.verify(
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
