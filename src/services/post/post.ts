import type { PostRepository } from "../../domain/post/repository.js";
import type { PostService } from "./post.types.js";

export function createPostService(postRepository: PostRepository): PostService {
    return {
        getPosts(category, take) {
            return postRepository.getAll(category, take);
        },

        getPostById(id) {
            return postRepository.getById(id);
        },

        createPost(post) {
            return postRepository.addPost(post);
        },
    };
}