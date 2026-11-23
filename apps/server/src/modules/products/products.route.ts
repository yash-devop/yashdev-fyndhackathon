import { Router } from "express";
import { productsController } from "./products.controller";

export const productsRouter: Router = Router();

productsRouter.get("/products", productsController.getProducts);
