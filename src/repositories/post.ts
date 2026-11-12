import { all } from "@prisma/orm-postgres/orm-client";
import type { PostRepository } from "../domain/post/repository.js";
import type { PostgresClient } from "@prisma/orm-postgres/runtime";
import type { Contract } from "../prisma/contract.js";
import { error } from "node:console";

export function createPostRepository(db: PostgresClient<Contract>): PostRepository {
  return {
      async getAll(categoryName, take) {
      if (categoryName) {
        const category = await db.orm.public.Category.where({ name: categoryName }).first();
        if (!category) return [];

        if (take) {
          return await db.orm.public.Post.where({ categoryId: category.id }).include("category").limit(take).all();
        }

        return await db.orm.public.Post.where({ categoryId: category.id }).include("category").all();
      }

      if (take) {
        return await db.orm.public.Post.where(() => all()).include("category").limit(take).all();
      }

      return await db.orm.public.Post.where(() => all()).include("category").all();
    },

    async getById(id) {
      return await db.orm.public.Post.where({ id }).include("category").first();
    },

    async addPost(post) {
      try{
        return await db.orm.public.Post.create(post);
      }catch (error) {
        if (error instanceof Error && "sqlState" in error) {
          if (error.sqlState === "23505") {
              throw new Error("PRODUCT ALREADY EXIST");
          }}}
          throw error
    },
    async getByAuthorId(userId: number) {
      return await db.orm.public.Post.where({ userId }).include("category").all();
    }
}}
