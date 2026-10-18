import { Router } from "express";
import type { UserHandler } from "../handlers/user.js";


export function createUserRouter(UserHandler: UserHandler) {
    const router = Router();

    router.post("/register", UserHandler.registerHandler);

    return router;
}