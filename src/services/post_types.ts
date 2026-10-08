import type { Post } from "../domain/post/entity.js";

export interface PostService {
    getPosts(category?: string, take?: number): Promise<Post[]>;
    getPostById(id: number): Promise<Post | undefined>;
    createPost(post: Omit<Post, "id">): Promise<Post>;
}