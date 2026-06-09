import { NextResponse } from "next/server";

import { comparePassword } from "@/lib/auth/password";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signInSchema } from "@/lib/validations/sign-in";

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

	const parsed = signInSchema.safeParse(body);

	if (!parsed.success) {
		return NextResponse.json(
			{
				message: "Invalid data.",
				errors: parsed.error.flatten().fieldErrors,
			},
			{ status: 400 },
		);
	}

	const { email, password } = parsed.data;

	const supabase = createSupabaseServerClient();

	const { data: account, error } = await supabase
		.from("accounts")
		.select("id, first_name, last_name, email, password")
		.eq("email", email)
		.maybeSingle();

	if (error || !account) {
		return NextResponse.json(
			{ message: "Invalid email or password." },
			{ status: 400 },
		);
	}

	const passwordMatches = await comparePassword(password, account.password);

	if (!passwordMatches) {
		return NextResponse.json(
			{ message: "Invalid email or password." },
			{ status: 400 },
		);
	}

	const token = await createSessionToken({ id: account.id });
	await setSessionCookie(token);

	return NextResponse.json(
		{ message: "Signed in successfully." },
		{
			status: 201,
		},
	);
}
