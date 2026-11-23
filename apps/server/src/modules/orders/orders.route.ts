import { Router } from "express";
import { ordersController } from "./orders.controller";
import { validateBodyMiddleware } from "../../middlewares/validate.middleware";
import { createOrderSchema } from "@repo/schemas";
export const orderRouter: Router = Router();

orderRouter.post(
  "/orders",
  validateBodyMiddleware(createOrderSchema),
  ordersController.createOrder,
);
