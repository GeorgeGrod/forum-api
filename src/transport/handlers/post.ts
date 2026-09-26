import type { Request, Response } from "express";
import type { PostResponse } from "../post/responses.js";
import type { PostRequest } from "../post/requests.js";
import type { ErrorResponse } from "../post/errors.js";
import {getPosts, getPostById, createPost} from "../../services/post.js";

export function getPostsHandler(req: Request<{}, PostResponse[] | ErrorResponse, {}, {category?: string; take?: string }>, res: Response<PostResponse[] | ErrorResponse>) {
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


  const posts = getPosts(category, numberTake);
  return res.status(200).json(posts);
}

export function getPostByIdHandler(req: Request<{ id: string }, PostResponse | ErrorResponse>, res: Response<PostResponse | ErrorResponse>) {
  const id = Number(req.params.id);
  const post = getPostById(id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({
      message: "Invalid id",
    });
  }

  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  return res.status(200).json(post);
}

export async function createPostHandler(
  req: Request<{}, PostResponse | ErrorResponse, PostRequest>, res: Response<PostResponse | ErrorResponse>) {
  const { title, content, author, category } = req.body;

  if (typeof title !== "string" || !title.trim() || typeof content !== "string" || !content.trim() || typeof author !== "string" || !author.trim() || typeof category !== "string" || !category.trim()) {
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

  const post = await createPost(newPost);

  return res.status(201).json(post);
}