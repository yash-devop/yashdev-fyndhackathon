import { Router } from "express";
import { ordersController } from "./orders.controller";
import {
  validateBodyMiddleware,
  validateParamsMiddleware,
  validateQueryMiddleware,
} from "../../middlewares/validate.middleware";
import {
  createOrderSchema,
  getOrdersSchema,
  orderIdParamSchema,
  updateOrderStatusSchema,
} from "@repo/schemas";
export const orderRouter: Router = Router();

orderRouter.post(
  "/orders",
  validateBodyMiddleware(createOrderSchema),
  ordersController.createOrder,
);

orderRouter.get(
  "/orders",
  validateQueryMiddleware(getOrdersSchema),
  ordersController.getOrders,
);

orderRouter.get(
  "/orders/:id",
  validateParamsMiddleware(orderIdParamSchema),
  ordersController.getOrderById,
);

orderRouter.patch(
  "/orders/:id/status",
  validateParamsMiddleware(orderIdParamSchema),
  validateBodyMiddleware(updateOrderStatusSchema),
  ordersController.updateOrderStatus,
);
