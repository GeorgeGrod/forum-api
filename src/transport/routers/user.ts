import { Router } from "express";
import { verifyAccessToken } from "../../lib/jwt";
import type { UserHandlerContract } from "../handlers/user";
import { RequireAuth } from "../middlewares/RequireAuth"


export function createUserRouter(userHandler: UserHandlerContract) {
  const router = Router();

  router.post("/register", userHandler.register);
  router.post("/login", userHandler.login);
  router.post("/refresh", userHandler.refresh);

  return router;
}