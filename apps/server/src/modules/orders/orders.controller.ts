import { Request, Response } from "express";
import { okResponse } from "../../lib/http";
import { CreateOrderInput } from "@repo/schemas";

export const ordersController = {
  createOrder: async (
    req: Request<undefined, {}, CreateOrderInput>,
    res: Response,
  ): Promise<void> => {
    okResponse(res, req.body.items);
  },
};
