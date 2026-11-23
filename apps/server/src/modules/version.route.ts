import { Router } from "express";
import { productsRouter } from "./products/products.route";

export const versionRouter = Router() as Router;

versionRouter.use("/v1", productsRouter);
