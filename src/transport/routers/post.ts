import {Router} from "express";
import type { PostHandler } from "../handlers/post.js";


export function createPostRouter(PostHandler:PostHandler){
    const router = Router();

    router.get("/posts", PostHandler.getPostsHandler);
    router.get("/posts/:id", PostHandler.getPostByIdHandler);
    router.post("/posts", PostHandler.createPostHandler);

return router
}
