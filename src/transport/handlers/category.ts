import type { Request, Response } from "express";
import type { CategoryResponse } from "../dto/category/responses.js";
import type { CategoryRequest } from "../dto/category/requests.js";
import type { CategoryService } from "../../services/category/category.types.js";
import type { ErrorResponse } from "../dto/errors.js";


export interface CategoryHandler {
  getCategoriesHandler(
    req: Request,
    res: Response<CategoryResponse[] | ErrorResponse>
  ): void;

  getCategoryByIdHandler(
    req: Request<{ id: string }>,
    res: Response<CategoryResponse | ErrorResponse>
  ): void;

  createCategoryHandler(
    req: Request<{}, CategoryResponse | ErrorResponse, CategoryRequest>,
    res: Response<CategoryResponse | ErrorResponse>
  ): void;
}


export function createCategoryHandler(categoryService: CategoryService): CategoryHandler {
  return {

    async getCategoriesHandler(req, res) {
      try {
        const categories = await categoryService.getCategories();

        return res.status(200).json(categories);
      } catch {
        return res.status(500).json({
          message: "Internal server error",
        });
      }
    },

    async getCategoryByIdHandler(req, res) {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          message: "Invalid id",
        });
      }

      try {
        const category = await categoryService.getCategoryById(id);

        if (!category) {
          return res.status(404).json({
            message: "Category not found",
          });
        }

        return res.status(200).json(category);
      } catch {
        return res.status(500).json({
          message: "Internal server error",
        });
      }
    },

    async createCategoryHandler(req, res) {
      const { name } = req.body;

      if (typeof name !== "string" || !name.trim()) {
        return res.status(422).json({
          message: "Invalid category data",
        });
      }

      const categoryName = name.trim().toLowerCase();

      try {
        const existing = await categoryService.getCategoryByName(categoryName);

        if (existing) {
          return res.status(409).json({
            message: "Category already exists",
          });
        }

        const category = await categoryService.createCategory({ name: categoryName });

        return res.status(201).json(category);
      } catch {
        return res.status(500).json({
          message: "Internal server error",
        });
      }
    },

  }
}