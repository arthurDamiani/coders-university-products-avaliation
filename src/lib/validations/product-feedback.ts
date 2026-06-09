import { z } from "zod";

export const productFeedbackSchema = z.object({
	score: z
		.number("Enter a score")
		.int("Score must be a whole number")
		.min(1, "Minimum score is 1")
		.max(5, "Maximum score is 5"),
	comment: z.string().trim().min(1, "Enter a comment"),
});

export type ProductFeedbackInput = z.infer<typeof productFeedbackSchema>;
