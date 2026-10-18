import type { PostgresClient } from "@prisma/orm-postgres/runtime";
import type { CategoryRepository } from "../domain/category/repository.js";
import type { Contract } from "../prisma/contract.js";

export function createCategoryRepository(db: PostgresClient<Contract>): CategoryRepository {
  return {
    async getAll() {
      return await db.orm.public.Category.all();
    },

    async getById(id) {
      return await db.orm.public.Category.where({ id }).first();
    },

    async getByName(name) {
      return await db.orm.public.Category.where({ name }).first();
    },

    async addCategory(category) {
    try {
        return await db.orm.public.Category.create(category);
    } catch (error) {
        if (error instanceof Error && "sqlState" in error && error.sqlState === "23505") {
          throw new Error("Category already exists");
        }
        throw error;
    }
},
  };
}