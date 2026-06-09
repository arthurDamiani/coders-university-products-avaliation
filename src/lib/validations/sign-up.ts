import { z } from "zod";

export const signUpSchema = z
	.object({
		first_name: z.string().trim().min(1, "Enter your first name"),
		last_name: z.string().trim().min(1, "Enter your last name"),
		email: z.email("Enter a valid email"),
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirm_password: z.string().min(1, "Confirm your password"),
	})
	.refine((data) => data.password === data.confirm_password, {
		message: "Passwords do not match",
		path: ["confirm_password"],
	});

export type SignUpInput = z.infer<typeof signUpSchema>;
