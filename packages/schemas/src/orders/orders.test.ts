import { describe, it, expect } from "vitest";
import { createOrderSchema } from "./orders";

describe("createOrderSchema", () => {
  const validOrder = {
    items: [
      {
        productId: "550e8400-e29b-41d4-a716-446655440000",
        quantity: 2,
      },
    ],
  };

  it("should accept a valid order", () => {
    const result = createOrderSchema.safeParse(validOrder);

    expect(result.success).toBe(true);
  });

  it("should accept multiple different products", () => {
    const result = createOrderSchema.safeParse({
      items: [
        {
          productId: "550e8400-e29b-41d4-a716-446655440000",
          quantity: 2,
        },
        {
          productId: "6ba7b810-9dad-41d1-80b4-00c04fd430c8",
          quantity: 1,
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("should reject an empty items array", () => {
    const result = createOrderSchema.safeParse({ items: [] });

    expect(result.success).toBe(false);
  });

  it("should reject an invalid product UUID", () => {
    const result = createOrderSchema.safeParse({
      items: [{ productId: "xyz-invalid", quantity: 2 }],
    });

    expect(result.success).toBe(false);
  });

  it("should reject quantity whose type is string and not number", () => {
    const result = createOrderSchema.safeParse({
      items: [{ productId: validOrder.items[0]?.productId, quantity: "2" }],
    });

    expect(result.success).toBe(false);
  });
  it("should reject zero quantity", () => {
    const result = createOrderSchema.safeParse({
      items: [{ productId: validOrder.items[0]?.productId, quantity: 0 }],
    });

    expect(result.success).toBe(false);
  });

  it("should reject negative quantity", () => {
    const result = createOrderSchema.safeParse({
      items: [{ productId: validOrder.items[0]?.productId, quantity: -2 }],
    });

    expect(result.success).toBe(false);
  });

  it("should reject decimal quantity", () => {
    const result = createOrderSchema.safeParse({
      items: [{ productId: validOrder.items[0]?.productId, quantity: 1.5 }],
    });

    expect(result.success).toBe(false);
  });

  it("should reject duplicate products", () => {
    const result = createOrderSchema.safeParse({
      items: [
        { productId: validOrder.items[0]?.productId, quantity: 2 },
        { productId: validOrder.items[0]?.productId, quantity: 3 },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("should reject client-supplied price", () => {
    const result = createOrderSchema.safeParse({
      items: [
        {
          productId: validOrder.items[0]?.productId,
          quantity: 2,
          price: 100,
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("should reject client-supplied total", () => {
    const result = createOrderSchema.safeParse({
      ...validOrder,
      total: 200,
    });

    expect(result.success).toBe(false);
  });
});
