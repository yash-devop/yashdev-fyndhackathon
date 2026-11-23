import { Router } from "express";
import { productsRouter } from "./products/products.route";
import { orderRouter } from "./orders/orders.route";

export const versionRouter = Router() as Router;

versionRouter.use("/v1", productsRouter);
versionRouter.use("/v1", orderRouter);
