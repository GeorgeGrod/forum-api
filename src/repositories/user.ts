import type { PostgresClient } from "@prisma/orm-postgres/runtime";
import type { UserRepository } from "../domain/user/repository.js";
import type { Contract } from "../prisma/contract.js";

export function createUserRepository(db: PostgresClient<Contract>): UserRepository {
  return {
    async getByEmail(email) {
      return await db.orm.public.User.where({ email }).first();
    },

    async addUser(user) {
      try {
          const newUser = await db.orm.public.User.create(user);
          return newUser;
      }
      catch(error) {
          if(error instanceof Error && "sqlState" in error && error.sqlState == "23505") {
              throw new Error("Email is already used!");
          }
          throw error;
      }
    },
    async getUserById(id) {
      return db.orm.public.User.where({ id }).first();
    },
  };
}