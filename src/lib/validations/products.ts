import { z } from "zod";

export const listProductsQuerySchema = z.object({
	cursor: z.string().trim().min(1).optional(),
	limit: z.coerce.number().int().min(1).max(50).default(12),
});

export type ListProductsQueryInput = z.infer<typeof listProductsQuerySchema>;
