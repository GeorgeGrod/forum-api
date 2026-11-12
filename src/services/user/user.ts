import type { UserRepository } from "../../domain/user/repository.js";
import type {
  UserService,
  TokenVerifierContract,
  TokenSignerContract,
  PasswordHasherContract,
  PublicUser,
} from "./user.types.js";

export function createUserService(
  userRepository: UserRepository,
  passwordHasher: PasswordHasherContract,
  tokenSigner: TokenSignerContract,
  tokenVerifier: TokenVerifierContract,
): UserService {
  return {
    async register(data) {
      const passwordHash = await passwordHasher.hashPassword(data.password);

      const user = await userRepository.addUser({
        email: data.email.trim().toLowerCase(),
        name: data.name.trim(),
        passwordHash,
      });

      const { passwordHash: _, ...publicUser } = user;

      return publicUser;
    },

    async login(input) {
      const user = await userRepository.getByEmail(
        input.email.trim().toLowerCase()
      );

      if (!user) {
        throw new Error("Invalid email or password");
      }

      const isPasswordValid = await passwordHasher.verifyPassword(
        input.password,
        user.passwordHash
      );

      if (!isPasswordValid) {
        throw new Error("Invalid email or password");
      }

      const publicUser: PublicUser = {
        id: user.id,
        email: user.email,
        name: user.name,
      };

      return {
        user: publicUser,
        accessToken: tokenSigner.signAccessToken(user.id),
        refreshToken: tokenSigner.signRefreshToken(user.id),
      };
    },

    async refresh(refreshToken) {
      const userId = tokenVerifier.verifyRefreshToken(refreshToken);
      const user = await userRepository.getUserById(userId);

      if (!user) {
        throw new Error("Invalid refresh token");
      }

      return {
        accessToken: tokenSigner.signAccessToken(user.id),
        refreshToken: tokenSigner.signRefreshToken(user.id),
      };
    },

    async me(id) {
      const user = await userRepository.getUserById(id);

      if (!user) {
        throw new Error("UNAUTHORIZED");
      }

      const { passwordHash: _, ...publicUser } = user;

      return publicUser;
    },
  };
}