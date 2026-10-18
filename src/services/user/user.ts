import bcrypt from "bcryptjs";
import type { UserRepository } from "../../domain/user/repository.js";
import type { UserService } from "./user.types.js";

const SALT_ROUNDS = 10;

export function createUserService(userRepository: UserRepository): UserService {
  return {
    getUserByEmail(email) {
      return userRepository.getByEmail(email);
    },

    async registerUser(data) {
      const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

      return userRepository.addUser({
        email: data.email,
        name: data.name,
        passwordHash,
      });
    },
  };
}