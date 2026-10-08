import express from "express";
import { db } from "./prisma/db.js";
import { createPostRepository } from "./repositories/post.js";
import { createPostService } from "./services/post.js";
import { createPostHandler } from "./transport/handlers/post.js";
import { createPostRouter } from "./transport/routers/post.js";

const app = express();

app.use(express.json());

const postRepository = createPostRepository(db);
const postService = createPostService(postRepository);
const postHandler = createPostHandler(postService);
const postRouter = createPostRouter(postHandler);

app.use(postRouter);

const HOST = "localhost";
const PORT = 8000;

app.listen(PORT, HOST, () => {
  console.log(`http://${HOST}:${PORT}`);
});