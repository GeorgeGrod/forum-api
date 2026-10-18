import type { Category } from "../../domain/category/entity.js";

export interface CategoryService {
    getCategories(): Promise<Category[]>;
    getCategoryById(id: number): Promise<Category | null>;
    getCategoryByName(name: string): Promise<Category | null>;
    createCategory(category: Omit<Category, "id">): Promise<Category>;
}