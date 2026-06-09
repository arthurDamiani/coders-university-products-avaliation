import { z } from "zod";

export const createProductSchema = z.object({
	name: z.string().trim().min(1, "Enter the product name"),
	link: z.url("Enter a valid link"),
	image: z.url("Enter a valid image URL"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
