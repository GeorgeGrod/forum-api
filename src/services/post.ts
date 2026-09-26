
import { getAll, getById, addPost } from "../repositories/post.js";
import type { PostRequest } from "../transport/post/requests.js";
import type { PostResponse } from "../transport/post/responses.js";


export function getPosts(category?: string, take?: number): PostResponse[] {
  return getAll(category, take);
}

export function getPostById(id: number): PostResponse | undefined {
  return getById(id);
}

export function createPost(post: PostRequest) {
  return addPost(post);
}
