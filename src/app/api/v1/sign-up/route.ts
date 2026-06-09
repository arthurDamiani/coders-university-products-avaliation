import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

import { hashPassword } from "@/lib/auth/password";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signUpSchema } from "@/lib/validations/sign-up";

export async function POST(request: Request) {
	let body: unknown;

	try {
		body = await request.json();
	} catch {
		return NextResponse.json(
			{ message: "Invalid request body. Expected JSON." },
			{ status: 400 },
		);
	}

	const parsed = signUpSchema.safeParse(body);

	if (!parsed.success) {
		return NextResponse.json(
			{
				message: "Invalid data.",
				errors: parsed.error.flatten().fieldErrors,
			},
			{ status: 400 },
		);
	}

	const { first_name, last_name, email, password } = parsed.data;
	const { hashedPassword, salt } = await hashPassword(password);

	const supabase = createSupabaseServerClient();

	const { error } = await supabase.from("accounts").insert({
		id: nanoid(),
		first_name,
		last_name,
		email,
		password: hashedPassword,
		salt,
		active: true,
	});

	if (error) {
		const status = error.code === "23505" ? 400 : 500;
		const message =
			error.code === "23505"
				? "An account with this email already exists."
				: "Could not create account. Please try again.";

		return NextResponse.json({ message }, { status });
	}

	return NextResponse.json(
		{ message: "Account created successfully." },
		{ status: 201 },
	);
}
