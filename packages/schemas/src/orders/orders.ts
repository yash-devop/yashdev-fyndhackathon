import { z } from "zod";

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

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
