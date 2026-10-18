import type { Request, Response } from "express";
import type { RegisterRequest } from "../dto/user/requests.js";
import type { UserResponse } from "../dto/user/responses.js";
import type { ErrorResponse } from "../dto/errors.js";
import type { UserService } from "../../services/user/user.types.js";


export interface UserHandler {
  registerHandler(
    req: Request<{}, UserResponse | ErrorResponse, RegisterRequest>,
    res: Response<UserResponse | ErrorResponse>
  ): void;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function createUserHandler(userService: UserService): UserHandler {
  return {

    async registerHandler(req, res) {
      const { email, name, password } = req.body;

      if (
        typeof email !== "string" ||
        !email.trim() ||
        typeof name !== "string" ||
        !name.trim() ||
        typeof password !== "string" ||
        !password
      ) {
        return res.status(422).json({
          message: "Invalid registration data",
        });
      }

      const lowEmail = email.trim().toLowerCase();

      if (!EMAIL_PATTERN.test(lowEmail)) {
        return res.status(422).json({
          message: "Invalid email",
        });
      }

      if (password.length < 3) {
        return res.status(422).json({
          message: "Password must be at least 3 characters",
        });
      }

      try {
        const exists = await userService.getUserByEmail(lowEmail);

        if (exists) {
          return res.status(409).json({
            message: "This email already used",
          });
        }

        const user = await userService.registerUser({
          email: lowEmail,
          name: name.trim(),
          password,
        });

        return res.status(201).json({
          id: user.id,
          email: user.email,
          name: user.name,
        });
        } catch {
            return res.status(500).json({
              message: "Internal server error",
            });
        }
    },
  }
}