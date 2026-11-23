import { Request, Response } from "express";
import { okResponse } from "../../lib/http";
import { productsService } from "./products.service";

export const productsController = {
  getProducts: async (_req: Request, res: Response): Promise<void> => {
    const data = await productsService.getProducts();

    okResponse(res, data, "Products fetched successfully");
  },
};
