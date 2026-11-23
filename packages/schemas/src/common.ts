import z from "zod";

export const idParamSchema = z.object({
  id: z.string().min(1),
});

export type IdParamType = z.infer<typeof idParamSchema>;

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationQueryType = z.infer<typeof paginationQuerySchema>;
