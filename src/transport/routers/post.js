import { Router } from "express";
export function createPostRouter(PostHandler) {
    const router = Router();
    router.get("/posts", PostHandler.getPostsHandler);
    router.get("/posts/:id", PostHandler.getPostByIdHandler);
    router.post("/posts", PostHandler.createPostHandler);
    return router;
}
