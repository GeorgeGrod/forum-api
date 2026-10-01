export function createPostRepository() {
    let posts = [
        {
            id: 1,
            title: "Dota 2",
            content: "гайд як грати",
            author: "Георгій",
            category: "games",
        },
        {
            id: 2,
            title: "Reddit",
            content: "Найпопулярніший пост",
            author: "Богдан",
            category: "socialMedia",
        },
        {
            id: 3,
            title: "CS2",
            content: "гайд як грати",
            author: "Георгій",
            category: "games",
        }
    ];
    return {
        getAll(category, take) {
            let result = posts;
            if (category) {
                result = result.filter((post) => post.category === category);
            }
            if (!take) {
                return result;
            }
            result = result.slice(0, take);
            return result;
        },
        getById(id) {
            return posts.find((post) => post.id === id);
        },
        async addPost(post) {
            return new Promise((resolve) => {
                const newPost = {
                    id: posts.length + 1,
                    ...post,
                };
                posts = [...posts, newPost];
                resolve(newPost);
            });
        }
    };
}
