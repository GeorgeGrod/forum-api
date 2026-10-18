import type { CreatedPost, NewPost, Post } from "../../domain/post/entity.js";

export interface PostService {
    getPosts(category?: string, take?: number): Promise<Post[]>;
    getPostById(id: number): Promise<Post | null>;
    createPost(post: NewPost): Promise<CreatedPost>;
}