export function createPostService(postRepository) {
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
