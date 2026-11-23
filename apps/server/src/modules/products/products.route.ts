import { Router } from "express";
import { productsController } from "./products.controller";

export const productsRouter = Router() as Router;

productsRouter.get("/products", productsController.getProducts);
