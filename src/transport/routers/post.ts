import {Router} from "express";
import {getPostsHandler, getPostByIdHandler, createPostHandler} from "../handlers/post.js";


const router = Router();

router.get("/posts", getPostsHandler);
router.get("/posts/:id", getPostByIdHandler);
router.post("/posts", createPostHandler);

export default router;