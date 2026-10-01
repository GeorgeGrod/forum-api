import type { Request, Response } from "express";
import type { PostResponse } from "../dto/post/responses.js";
import type { PostRequest } from "../dto/post/requests.js";
import type { ErrorResponse } from "../dto/post/errors.js";
import type { PostService } from "../../services/post_types.js";

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
}


export function createPostHandler(postService: PostService): PostHandler {
  return{

    getPostsHandler(req,res) {
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
  
      const posts = postService.getPosts(category, numberTake);
  
      return res.status(200).json(posts);
    },
  
    getPostByIdHandler(req,res) {
      const id = Number(req.params.id);
  
      if (!Number.isInteger(id)) {
        return res.status(400).json({
          message: "Invalid id",
        });
      }
  
      const post = postService.getPostById(id);
  
      if (!post) {
        return res.status(404).json({
          message: "Post not found",
        });
      }
  
      return res.status(200).json(post);
    },
  
    async createPostHandler(req, res) {
      const { title, content, author, category } = req.body;
  
      if (
        typeof title !== "string" ||
        !title.trim() ||
        typeof content !== "string" ||
        !content.trim() ||
        typeof author !== "string" ||
        !author.trim() ||
        typeof category !== "string" ||
        !category.trim()
      ) {
        return res.status(422).json({
          message: "Invalid post data",
        });
      }
  
      const newPost: PostRequest = {
        title: title.trim(),
        content: content.trim(),
        author: author.trim(),
        category: category.trim(),
      };
  
      const post = await postService.createPost(newPost);
  
      return res.status(201).json(post);
    }
  
  }
}