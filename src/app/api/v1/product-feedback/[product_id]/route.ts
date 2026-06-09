import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

import { getCurrentAccount } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { productFeedbackSchema } from "@/lib/validations/product-feedback";

export async function POST(
	request: Request,
	{ params }: RouteContext<"/api/v1/product-feedback/[product_id]">,
) {
	const account = await getCurrentAccount();

	if (!account) {
		return NextResponse.json(
			{ message: "You must be authenticated to submit a feedback." },
			{ status: 401 },
		);
	}

	const { product_id } = await params;

	let body: unknown;

	try {
		body = await request.json();
	} catch {
		return NextResponse.json(
			{ message: "Invalid request body. Expected JSON." },
			{ status: 400 },
		);
	}

	const parsed = productFeedbackSchema.safeParse(body);

	if (!parsed.success) {
		return NextResponse.json(
			{
				message: "Invalid data.",
				errors: parsed.error.flatten().fieldErrors,
			},
			{ status: 400 },
		);
	}

	const { score, comment } = parsed.data;

	const supabase = createSupabaseServerClient();

	const { error } = await supabase.from("products_feedbacks").insert({
		id: nanoid(),
		score,
		comment,
		product_id,
	});

	if (error) {
		return NextResponse.json(
			{ message: "Could not register feedback. Please try again." },
			{ status: 500 },
		);
	}

	await recalculateProductScore(supabase, product_id);

	return NextResponse.json(
		{ message: "Feedback registered successfully." },
		{ status: 201 },
	);
}

async function recalculateProductScore(
	supabase: ReturnType<typeof createSupabaseServerClient>,
	productId: string,
) {
	const { data: feedbacks } = await supabase
		.from("products_feedbacks")
		.select("score")
		.eq("product_id", productId);

	if (!feedbacks || feedbacks.length === 0) {
		return;
	}

	const sum = feedbacks.reduce((total, feedback) => total + feedback.score, 0);
	const average = Math.round((sum / feedbacks.length) * 10) / 10;

	await supabase
		.from("products")
		.update({ score: average })
		.eq("id", productId);
}
