import type { Category } from "./entity.js";

export interface CategoryRepository {
  getAll(): Promise<Category[]>;
  getById(id: number): Promise<Category | null>;
  getByName(name: string): Promise<Category | null>;
  addCategory(category: Omit<Category, "id">): Promise<Category>;
}