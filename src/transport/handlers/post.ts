
import type { Request, Response } from "express";
import type { PostResponse } from "../dto/post/responses.js";
import type { PostRequest } from "../dto/post/requests.js";
import type { ErrorResponse } from "../dto/errors.js";
import type { Post } from "../../domain/post/entity.js";
import type { PostService } from "../../services/post/post.types.js";
import type { CategoryService } from "../../services/category/category.types.js";
import type { UserService } from "../../services/user/user.types.js";

export interface PostHandler {
  getPostsHandler(
    req: Request<{}, PostResponse[] | ErrorResponse, {}, { category?: string; take?: string }>,
    res: Response<PostResponse[] | ErrorResponse>
  ): void;

  getPostByIdHandler(
    req: Request<{ id: string }>,
    res: Response<PostResponse | ErrorResponse>
  ): void;

  createPostHandler(
    req: Request<{}, PostResponse | ErrorResponse, PostRequest>,
    res: Response<PostResponse | ErrorResponse>
  ): void;

  getMyPosts(
    req: Request,
    res: Response
  ): Promise<void>;
}

function toPostResponse(post: Post): PostResponse {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    author: post.author,
    category: post.category.name,
  };
}

export function createPostHandler(
  postService: PostService,
  categoryService: CategoryService,
  userService: UserService,
): PostHandler {
  return {
    async getPostsHandler(req, res) {
      const { category, take } = req.query;

      let numberTake: number | undefined;

      if (take !== undefined) {
        numberTake = Number(take);

        if (!Number.isInteger(numberTake) || numberTake <= 0) {
          return res.status(400).json({
            message: "Invalid take",
          });
        }
      }

      const categoryName = category?.trim().toLowerCase();

      try {
        const posts = await postService.getPosts(categoryName, numberTake);

        return res.status(200).json(posts.map(toPostResponse));
      } catch {
        return res.status(500).json({
          message: "Internal server error",
        });
      }
    },

    async getPostByIdHandler(req, res) {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          message: "Invalid id",
        });
      }

      try {
        const post = await postService.getPostById(id);

        if (!post) {
          return res.status(404).json({
            message: "Post not found",
          });
        }

        return res.status(200).json(toPostResponse(post));
      } catch {
        return res.status(500).json({
          message: "Internal server error",
        });
      }
    },

    async createPostHandler(req, res) {
      const userId = res.locals.userId;

      if (typeof userId !== "number") {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      const { title, content, categoryId } = req.body;

      if (
        typeof title !== "string" ||
        !title.trim() ||
        typeof content !== "string" ||
        !content.trim()
      ) {
        return res.status(422).json({
          message: "Invalid post data",
        });
      }

      if (!Number.isInteger(categoryId) || categoryId <= 0) {
        return res.status(400).json({
          message: "Invalid categoryId",
        });
      }

      try {
        const [category, user] = await Promise.all([
          categoryService.getCategoryById(categoryId),
          userService.me(userId),
        ]);

        if (!category) {
          return res.status(404).json({
            message: "Category not found",
          });
        }

        const created = await postService.createPost({
          title: title.trim(),
          content: content.trim(),
          author: user.name,
          userId,
          categoryId,
        });

        return res.status(201).json({
          id: created.id,
          title: created.title,
          content: created.content,
          author: created.author,
          category: category.name,
        });
      } catch {
        return res.status(500).json({
          message: "Internal server error",
        });
      }
    },

    async getMyPosts(req, res) {
      const userId = res.locals.userId;

      if (typeof userId !== "number") {
        res.status(401).json({
          message: "Unauthorized",
        });
        return;
      }

      try {
        const posts = await postService.getPostsByAuthorId(userId);

        res.status(200).json(posts.map(toPostResponse));
      } catch {
        res.status(500).json({
          message: "Internal server error",
        });
      }
    },
  };
}
