import express from "express";
import { db } from "./prisma/db.js";
import { createPostRepository } from "./repositories/post.js";
import { createPostService } from "./services/post/post.js";
import { createPostHandler } from "./transport/handlers/post.js";
import { createPostRouter } from "./transport/routers/post.js";
import { createCategoryRepository } from "./repositories/category.js";
import { createCategoryService } from "./services/category/category.js";
import { createCategoryHandler } from "./transport/handlers/category.js";
import { createCategoryRouter } from "./transport/routers/category.js";
import { createUserRepository } from "./repositories/user.js";
import { createUserService } from "./services/user/user.js";
import { createUserHandler } from "./transport/handlers/user.js";
import { createUserRouter } from "./transport/routers/user.js";

const app = express();

app.use(express.json());

const categoryRepository = createCategoryRepository(db);
const postRepository = createPostRepository(db);
const userRepository = createUserRepository(db);

const categoryService = createCategoryService(categoryRepository);
const postService = createPostService(postRepository);
const userService = createUserService(userRepository);

const categoryHandler = createCategoryHandler(categoryService);
const postHandler = createPostHandler(postService, categoryService);
const userHandler = createUserHandler(userService);

app.use(createCategoryRouter(categoryHandler));
app.use(createPostRouter(postHandler));
app.use(createUserRouter(userHandler));

const HOST = "localhost";
const PORT = 8000;

app.listen(PORT, HOST, () => {
  console.log(`http://${HOST}:${PORT}`);
});