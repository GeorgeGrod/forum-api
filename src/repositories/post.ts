import { all } from "@prisma/orm-postgres/orm-client";
import type { PostRepository } from "../domain/post/repository.js";
import { db as database } from "../prisma/db.js";

type Db = typeof database;

export function createPostRepository(db: Db): PostRepository {
  return {
    async getAll(category, take) {
      const posts = category
        ? db.orm.public.Post.where({ category })
        : db.orm.public.Post.where(() => all());

      const rows = await (take ? posts.limit(take) : posts).all();
      return rows.map((p) => ({ ...p, content: p.content ?? "" }));
    },

    async getById(id) {
      const post = await db.orm.public.Post.where({ id }).first();
      return post ? { ...post, content: post.content ?? "" } : undefined;
    },

    async addPost(post) {
      const created = await db.orm.public.Post.create(post);
      return { ...created, content: created.content ?? "" };
    },
  };
}