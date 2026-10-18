import type { PostgresClient } from "@prisma/orm-postgres/runtime";
import type { UserRepository } from "../domain/user/repository.js";
import type { Contract } from "../prisma/contract.js";

export function createUserRepository(db: PostgresClient<Contract>): UserRepository {
  return {
    async getByEmail(email) {
      return await db.orm.public.User.where({ email }).first();
    },

    async addUser(user) {
      return await db.orm.public.User.create(user);
    },
  };
}