import "dotenv/config";

import type { Request, Response } from "express";
import type { UserService, UserTokens } from "../../services/user/user.types.js";
import type { LoginRequest, RegisterRequest } from "../dto/user/requests";


function setUserTokens(res: Response, tokens: UserTokens) {
  res.cookie("accessToken", tokens.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 60 * 1000,
    path: "/",
  });

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

export interface UserHandlerContract {
  register: (
    req: Request<{}, {}, RegisterRequest>,
    res: Response,
  ) => Promise<void>;

  login: (
    req: Request<{}, {}, LoginRequest>,
    res: Response,
  ) => Promise<void>;

  refresh(req: Request, res: Response): Promise<void>;

  me(req: Request, res: Response): Promise<void>;
}

export function createUserHandler(
  service: UserService,
): UserHandlerContract {
  return {
    async register(req, res) {
      try {
        const { email, name, password } = req.body;

        if (!email || !name || !password) {
          res.status(422).json({ message: "Validation Error!" });
          return;
        }

        const user = await service.register({ email, name, password });

        res.status(201).json(user);
      } catch (error) {
        if (error instanceof Error && error.message === "Email is already used!") {
          res.status(409).json({ message: error.message });
          return;
        }

        res.status(500).json({ message: "Internal Server Error!" });
      }
    },

    async login(req, res) {
      try {
        const { email, password } = req.body;

        if (!email || !password) {
          res.status(422).json({ message: "Validation Error!" });
          return;
        }

        const result = await service.login({ email, password });

        setUserTokens(res, {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        });

        res.status(200).json(result.user);
      } catch (error) {
        if (error instanceof Error && error.message === "Invalid email or password") {
          res.status(401).json({ message: error.message });
          return;
        }

        res.status(500).json({ message: "Internal Server Error!" });
      }
    },

    async refresh(req, res) {
      const refreshToken = req.cookies?.refreshToken;

      if (typeof refreshToken !== "string") {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      try {
        const tokens = await service.refresh(refreshToken);

        setUserTokens(res, tokens);

        res.status(200).json({ message: "Tokens updated" });
      } catch (error) {
        res.status(401).json({ message: "Invalid refresh token" });
      }
    },

    async me(req, res) {
      try {
        const userId = res.locals.userId;

        if (typeof userId !== "number") {
          res.status(401).json({ message: "Unauthorized" });
          return;
        }

        const user = await service.me(userId);

        res.status(200).json(user);
      } catch (error) {
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
          res.status(401).json({ message: "Unauthorized" });
          return;
        }

        res.status(500).json({ message: "Internal Server Error!" });
      }
    },
  };
}