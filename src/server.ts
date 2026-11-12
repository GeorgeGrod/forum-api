import "dotenv/config";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
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
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "./lib/jwt.js";
import { hashPassword, verifyPassword } from "./lib/password.js";

const app = express();

app.use(cors({origin: "http://localhost:5173"}));
app.use(express.json());
app.use(cookieParser());

const categoryRepository = createCategoryRepository(db);
const postRepository = createPostRepository(db);
const userRepository = createUserRepository(db);

const categoryService = createCategoryService(categoryRepository);
const postService = createPostService(postRepository);

const userService = createUserService(
  userRepository,
  {
    hashPassword,
    verifyPassword,
  },
  {
    signAccessToken,
    signRefreshToken,
  },
  {
    verifyAccessToken,
    verifyRefreshToken,
  },
);

const categoryHandler = createCategoryHandler(categoryService);
const postHandler = createPostHandler(
  postService,
  categoryService,
  userService
);
const userHandler = createUserHandler(userService);

app.use(createCategoryRouter(categoryHandler));
app.use(createPostRouter(postHandler));
app.use(createUserRouter(userHandler));

const HOST = "localhost";
const PORT = 8000;

app.listen(PORT, HOST, () => {
  console.log(`http://${HOST}:${PORT}`);
});