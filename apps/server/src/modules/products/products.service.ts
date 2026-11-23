import { prisma } from "@repo/db";
import { AppError } from "../../middlewares/error.middleware";

export type ProductListItemType = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  availability: "IN_STOCK" | "OUT_OF_STOCK";
};

export const productsService = {
  getProducts: async (): Promise<ProductListItemType[]> => {
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

      return products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price.toFixed(2),
        stock: product.stock,
        availability: product.stock > 0 ? "IN_STOCK" : "OUT_OF_STOCK",
      }));
    } catch (error) {
      throw new AppError("Failed to fetch products", 500, "INTERNAL_ERROR", {
        cause: error,
      });
    }
  },
};
