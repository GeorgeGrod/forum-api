import { Router } from "express";
import type { CategoryHandler } from "../handlers/category.js";


export function createCategoryRouter(CategoryHandler: CategoryHandler) {
    const router = Router();

    router.get("/categories", CategoryHandler.getCategoriesHandler);
    router.get("/categories/:id", CategoryHandler.getCategoryByIdHandler);
    router.post("/categories", CategoryHandler.createCategoryHandler);

    return router;
}