import { prisma, Prisma } from "@repo/db";
import { CreateOrderInput, GetOrderInput, UpdateOrderStatusInput } from "@repo/schemas";
import { randomBytes } from "node:crypto";
import { AppError } from "../../middlewares/error.middleware";

type OrderItemResponse = {
  id: string;
  productId: string;
  quantity: number;
  priceAtPurchase: string;
  subtotal: string;
};

type OrderDetailItemResponse = OrderItemResponse & {
  productName: string;
};

export type OrderResponse = {
  id: string;
  reference: string;
  status: string;
  total: string;
  createdAt: Date;
  items: OrderItemResponse[];
};

export type OrderDetailResponse = Omit<OrderResponse, "items"> & {
  items: OrderDetailItemResponse[];
};

export type GetOrdersResponse = {
  items: OrderResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const generateOrderCode = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = randomBytes(4).toString("hex").toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

const ORDER_STATUS_TRANSITIONS: Record<string, string[]> = {
  PLACED: ["PACKED", "CANCELLED"],
  PACKED: ["SHIPPED", "CANCELLED"],
  SHIPPED: [],
  CANCELLED: [],
};

const toOrderResponse = (order: {
  id: string;
  orderCode: string;
  status: string;
  total: Prisma.Prisma.Decimal;
  createdAt: Date;
  items: {
    id: string;
    productId: string;
    quantity: number;
    priceAtPurchase: Prisma.Prisma.Decimal;
    subtotal: Prisma.Prisma.Decimal;
  }[];
}): OrderResponse => ({
  id: order.id,
  reference: order.orderCode,
  status: order.status,
  total: order.total.toFixed(2),
  createdAt: order.createdAt,
  items: order.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,
    priceAtPurchase: item.priceAtPurchase.toFixed(2),
    subtotal: item.subtotal.toFixed(2),
  })),
});

export const ordersService = {
  getOrderById: async (id: string): Promise<OrderDetailResponse> => {
    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        orderCode: true,
        status: true,
        total: true,
        createdAt: true,
        items: {
          select: {
            id: true,
            productId: true,
            quantity: true,
            priceAtPurchase: true,
            subtotal: true,
            product: { select: { name: true } },
          },
        },
      },
    });

    if (!order) {
      throw new AppError("Order not found", 404, "NOT_FOUND", { orderId: id });
    }

    return {
      id: order.id,
      reference: order.orderCode,
      status: order.status,
      total: order.total.toFixed(2),
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase.toFixed(2),
        subtotal: item.subtotal.toFixed(2),
      })),
    };
  },

  getOrders: async (input: GetOrderInput): Promise<GetOrdersResponse> => {
    const where: Prisma.Prisma.OrderWhereInput = {
      ...(input.status ? { status: input.status } : {}),
      ...(input.search
        ? { orderCode: { contains: input.search, mode: "insensitive" } }
        : {}),
    };

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (input.page - 1) * input.limit,
        take: input.limit,
        select: {
          id: true,
          orderCode: true,
          status: true,
          total: true,
          createdAt: true,
          items: {
            select: {
              id: true,
              productId: true,
              quantity: true,
              priceAtPurchase: true,
              subtotal: true,
            },
          },
        },
      }),
    ]);

    return {
      items: orders.map(toOrderResponse),
      pagination: {
        page: input.page,
        limit: input.limit,
        total,
        totalPages: Math.ceil(total / input.limit),
      },
    };
  },

  updateOrderStatus: async (
    id: string,
    input: UpdateOrderStatusInput,
  ): Promise<OrderDetailResponse> => {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id },
        select: {
          id: true,
          orderCode: true,
          status: true,
          total: true,
          createdAt: true,
          items: {
            select: {
              id: true,
              productId: true,
              quantity: true,
              priceAtPurchase: true,
              subtotal: true,
              product: { select: { name: true } },
            },
          },
        },
      });

      if (!order) {
        throw new AppError("Order not found", 404, "NOT_FOUND", { orderId: id });
      }

      const allowed = ORDER_STATUS_TRANSITIONS[order.status] ?? [];
      if (!allowed.includes(input.status)) {
        throw new AppError(
          `Cannot transition order from ${order.status} to ${input.status}`,
          409,
          "CONFLICT",
          { orderId: id, from: order.status, to: input.status },
        );
      }

      if (input.status === "CANCELLED") {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }

      const updated = await tx.order.update({
        where: { id },
        data: {
          status: input.status,
          ...(input.status === "CANCELLED" ? { cancelledAt: new Date() } : {}),
        },
        select: {
          id: true,
          orderCode: true,
          status: true,
          total: true,
          createdAt: true,
          items: {
            select: {
              id: true,
              productId: true,
              quantity: true,
              priceAtPurchase: true,
              subtotal: true,
              product: { select: { name: true } },
            },
          },
        },
      });

      return {
        id: updated.id,
        reference: updated.orderCode,
        status: updated.status,
        total: updated.total.toFixed(2),
        createdAt: updated.createdAt,
        items: updated.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          productName: item.product.name,
          quantity: item.quantity,
          priceAtPurchase: item.priceAtPurchase.toFixed(2),
          subtotal: item.subtotal.toFixed(2),
        })),
      };
    });
  },

  createOrder: async (input: CreateOrderInput): Promise<OrderResponse> => {
    const productIds = input.items.map((item) => item.productId);

    return prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
        select: {
          id: true,
          price: true,
          stock: true,
          isActive: true,
        },
      });

      const productsById = new Map(
        products.map((product) => [product.id, product]),
      );

      for (const item of input.items) {
        const product = productsById.get(item.productId);

        if (!product) {
          throw new AppError(
            `Product ${item.productId} not found`,
            404,
            "NOT_FOUND",
            { productId: item.productId },
          );
        }

        if (!product.isActive) {
          throw new AppError(
            `Product ${item.productId} is not available`,
            409,
            "CONFLICT",
            { productId: item.productId },
          );
        }

        if (product.stock < item.quantity) {
          throw new AppError(
            `Insufficient stock for product ${item.productId}`,
            409,
            "CONFLICT",
            {
              productId: item.productId,
              requested: item.quantity,
              available: product.stock,
            },
          );
        }
      }

      const orderItems = input.items.map((item) => {
        const product = productsById.get(item.productId)!;
        const subtotal = product.price.mul(item.quantity);

        return {
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: product.price,
          subtotal,
        };
      });

      const total = orderItems.reduce(
        (sum, item) => sum.add(item.subtotal),
        new Prisma.Prisma.Decimal(0),
      );

      for (const item of input.items) {
        const stockUpdate = await tx.product.updateMany({
          where: {
            id: item.productId,
            isActive: true,
            stock: { gte: item.quantity },
          },
          data: {
            stock: { decrement: item.quantity },
          },
        });

        if (stockUpdate.count !== 1) {
          throw new AppError(
            `Insufficient stock for product ${item.productId}`,
            409,
            "CONFLICT",
            { productId: item.productId, requested: item.quantity },
          );
        }
      }

      const order = await tx.order.create({
        data: {
          orderCode: generateOrderCode(),
          status: "PLACED",
          total,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            select: {
              id: true,
              productId: true,
              quantity: true,
              priceAtPurchase: true,
              subtotal: true,
            },
          },
        },
      });

      return toOrderResponse(order);
    });
  },
};
