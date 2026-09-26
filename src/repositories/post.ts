import type { PostRequest } from "../transport/post/requests.js";
import type { PostResponse } from "../transport/post/responses.js";

let posts: PostResponse[] = [
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

export function getAll(category?: string, take?: number): PostResponse[] {
  let result = posts;

  if (category) {
    result = result.filter((post) => post.category === category)}

  if (!take) {
    return result;
  }

  result = result.slice(0, take);
  return result;
}

export function getById(id: number): PostResponse | undefined {
  return posts.find((post) => post.id === id);
}

export async function addPost(post: PostRequest) {
  return new Promise((resolve) => {
    const newPost: PostResponse = {
        id: posts.length + 1,
        ...post,
    };

    posts = [...posts, newPost];
    resolve(newPost);
  });
}