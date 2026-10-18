import type { CreatedPost, NewPost, Post } from "./entity.js";

export interface PostRepository {
  getAll(category?: string, take?: number): Promise<Post[]>;
  getById(id: number): Promise<Post | null>;
  addPost(post: NewPost): Promise<CreatedPost>;
}