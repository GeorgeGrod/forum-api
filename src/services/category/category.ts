import type { CategoryRepository } from "../../domain/category/repository.js";
import type { CategoryService } from "./category.types.js";

export function createCategoryService(categoryRepository: CategoryRepository): CategoryService {
    return {
        getCategories() {
            return categoryRepository.getAll();
        },

        getCategoryById(id) {
            return categoryRepository.getById(id);
        },

        getCategoryByName(name) {
            return categoryRepository.getByName(name);
        },

        createCategory(category) {
            return categoryRepository.addCategory(category);
        },
    };
}