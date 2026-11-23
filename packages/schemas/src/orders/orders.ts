import { z } from "zod";

export const ORDER_STATUSES = [
  "PLACED",
  "PACKED",
  "SHIPPED",
  "CANCELLED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const createOrderSchema = z
  .object({
    items: z
      .array(
        z
          .object({
            productId: z.uuid(),
            quantity: z.number().int().positive(),
          })
          .strict(),
      )
      .min(1, "Order must contain at least one product")
      .refine(
        (items) => {
          const productIds = items.map((item) => item.productId);
          return new Set(productIds).size === productIds.length; // for exmple: [1,2,3,4,5] === [1,2,3,4,5] => TRUE  and [1,1,1,2,3] which turns into [1,2,3] bcoz of set === [1,1,1,2,3] => FALSE;
        },
        {
          message: "Duplicate products are not allowed",
        },
      ),
  })
  .strict();

export const getOrdersSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().min(1).optional(),
  status: z.enum(ORDER_STATUSES).optional(),
});

export const orderIdParamSchema = z.object({
  id: z.uuid(),
});

export const updateOrderStatusSchema = z
  .object({
    status: z.enum(ORDER_STATUSES),
  })
  .strict();

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type GetOrderInput = z.infer<typeof getOrdersSchema>;
export type OrderIdParamInput = z.infer<typeof orderIdParamSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
