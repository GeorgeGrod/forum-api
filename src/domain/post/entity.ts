import type { Category } from "../category/entity.js";

export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  category: Category;
}

export interface NewPost {
  title: string;
  content: string;
  author: string;
  categoryId: number;
}

export interface CreatedPost {
  id: number;
  title: string;
  content: string;
  author: string;
  categoryId: number;
}
