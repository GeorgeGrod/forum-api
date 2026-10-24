
import type { Request, Response } from "express";
import type { RegisterRequest } from "../dto/user/requests.js";
import type { UserResponse } from "../dto/user/responses.js";
import type { ErrorResponse } from "../dto/errors.js";
import type { UserService } from "../../services/user/user.types.js";

export interface UserHandler {
  registerHandler(
    req: Request<{}, UserResponse | ErrorResponse, RegisterRequest>,
    res: Response<UserResponse | ErrorResponse>
  ): Promise<void>;
}

export function createUserHandler(userService: UserService): UserHandler {
  return {
    async registerHandler(req, res): Promise<void> {
      const { email, name, password } = req.body;

      if (
        typeof email !== "string" ||
        !email.trim() ||
        typeof name !== "string" ||
        !name.trim() ||
        typeof password !== "string" ||
        !password
      ) {
        res.status(422).json({
          message: "Invalid registration data",
        });
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();

      if (password.length < 3) {
        res.status(422).json({
          message: "Password must be at least 3 characters",
        });
        return;
      }

      try {
        const exists = await userService.getUserByEmail(
          normalizedEmail
        );

        if (exists) {
          res.status(409).json({
            message: "This email already used",
          });
          return;
        }

        const user = await userService.registerUser({
          email: normalizedEmail,
          name: name.trim(),
          password,
        });

        res.status(201).json({
          id: user.id,
          email: user.email,
          name: user.name,
        });
      } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
          message: "Internal server error",
        });
      }
    },
  };
}