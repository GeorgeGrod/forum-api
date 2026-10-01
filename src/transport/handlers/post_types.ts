import type { Request, Response } from "express";
import type { PostResponse } from "../dto/post/responses.js";
import type { PostRequest } from "../dto/post/requests.js";
import type { ErrorResponse } from "../dto/post/errors.js";

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