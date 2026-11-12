
import { Router } from "express";
import type { PostHandler } from "../handlers/post.js";
import { verifyAccessToken } from "../../lib/jwt.js";
import { RequireAuth } from "../middlewares/RequireAuth.js";

export function createPostRouter(PostHandler: PostHandler) {
    const router = Router();

    router.get("/posts", PostHandler.getPostsHandler);

    router.get(
        "/posts/me",
        RequireAuth(verifyAccessToken),
        PostHandler.getMyPosts
    );

    router.get("/posts/:id", PostHandler.getPostByIdHandler);

    router.post(
        "/posts",
        RequireAuth(verifyAccessToken),
        PostHandler.createPostHandler
    );

    return router;
}
