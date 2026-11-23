import { prisma, Prisma } from "@repo/db";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { ordersService } from "./orders.service";

describe("orders service integration", () => {
  let productAId: string;
  let productBId: string;

  beforeEach(async () => {
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();

    const [productA, productB] = await Promise.all([
      prisma.product.create({
        data: {
          name: "Test Product A",
          price: new Prisma.Prisma.Decimal("10.00"),
          stock: 10,
        },
      }),
      prisma.product.create({
        data: {
          name: "Test Product B",
          price: new Prisma.Prisma.Decimal("25.50"),
          stock: 5,
        },
      }),
    ]);

    productAId = productA.id;
    productBId = productB.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("places an order, saves it with the correct total, and deducts stock", async () => {
    const order = await ordersService.createOrder({
      items: [
        { productId: productAId, quantity: 2 },
        { productId: productBId, quantity: 1 },
      ],
    });

    expect(order.status).toBe("PLACED");
    expect(order.total).toBe("45.50");

    const savedOrder = await prisma.order.findUniqueOrThrow({
      where: { id: order.id },
      include: { items: true },
    });
    expect(savedOrder.total.toFixed(2)).toBe("45.50");
    expect(savedOrder.items).toHaveLength(2);

    const [updatedA, updatedB] = await Promise.all([
      prisma.product.findUniqueOrThrow({ where: { id: productAId } }),
      prisma.product.findUniqueOrThrow({ where: { id: productBId } }),
    ]);
    expect(updatedA.stock).toBe(8);
    expect(updatedB.stock).toBe(4);
  });

  it("rolls back stock when only one product in a multi-product order has insufficient stock", async () => {
    await expect(
      ordersService.createOrder({
        items: [
          { productId: productAId, quantity: 2 },
          { productId: productBId, quantity: 6 },
        ],
      }),
    ).rejects.toMatchObject({
      status: 409,
      code: "CONFLICT",
      message: expect.stringContaining("Insufficient stock"),
      meta: expect.objectContaining({ productId: productBId }),
    });

    expect(await prisma.order.count()).toBe(0);

    const [unchangedA, unchangedB] = await Promise.all([
      prisma.product.findUniqueOrThrow({ where: { id: productAId } }),
      prisma.product.findUniqueOrThrow({ where: { id: productBId } }),
    ]);
    expect(unchangedA.stock).toBe(10);
    expect(unchangedB.stock).toBe(5);
  });

  it("rejects a PLACED to SHIPPED transition and keeps the order PLACED", async () => {
    const order = await ordersService.createOrder({
      items: [{ productId: productAId, quantity: 1 }],
    });

    await expect(
      ordersService.updateOrderStatus(order.id, { status: "SHIPPED" }),
    ).rejects.toMatchObject({
      status: 409,
      code: "CONFLICT",
      message: expect.stringContaining("Cannot transition order from PLACED to SHIPPED"),
    });

    const savedOrder = await prisma.order.findUniqueOrThrow({
      where: { id: order.id },
    });
    expect(savedOrder.status).toBe("PLACED");
  });
});
