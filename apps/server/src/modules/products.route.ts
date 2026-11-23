import { prisma } from "@repo/db";
import { Router } from "express";
import { okResponse } from "../lib/http";

export const productsRouter = Router() as Router;

productsRouter.get("/", async (_req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
      },
    });

    const data = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price.toFixed(2),
      stock: product.stock,
      availability: product.stock > 0 ? "IN_STOCK" : "OUT_OF_STOCK",
    }));

    return okResponse(res, data, "Products fetched successfully");
  } catch (error) {
    next(error);
  }
});
