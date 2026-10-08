import type { Post } from "./entity.js";
import type { PostResponse } from "../../transport/dto/post/responses.js";

export interface PostRepository {
  getAll(category?: string, take?: number): Promise<PostResponse[]>;
  getById(id: number): Promise<PostResponse | undefined>;
  addPost(post: Omit<Post, "id">): Promise<Post>;
}