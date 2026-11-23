import { Request, Response } from "express";
import {
  CreateOrderInput,
  GetOrderInput,
  OrderIdParamInput,
  UpdateOrderStatusInput,
} from "@repo/schemas";
import { createdResponse, okResponse } from "../../lib/http";
import { ordersService } from "./orders.service";

export const ordersController = {
  createOrder: async (
    req: Request<unknown, unknown, CreateOrderInput>,
    res: Response,
  ): Promise<void> => {
    const data = await ordersService.createOrder(req.body);

    createdResponse(res, data, "Order created successfully");
  },

  getOrders: async (
    req: Request<unknown, unknown, unknown, GetOrderInput>,
    res: Response,
  ): Promise<void> => {
    const data = await ordersService.getOrders(req.query);

    okResponse(res, data, "Orders fetched successfully");
  },

  getOrderById: async (
    req: Request<OrderIdParamInput>,
    res: Response,
  ): Promise<void> => {
    const data = await ordersService.getOrderById(req.params.id);

    okResponse(res, data, "Order fetched successfully");
  },

  updateOrderStatus: async (
    req: Request<OrderIdParamInput, unknown, UpdateOrderStatusInput>,
    res: Response,
  ): Promise<void> => {
    const data = await ordersService.updateOrderStatus(req.params.id, req.body);

    okResponse(res, data, "Order status updated successfully");
  },
};
