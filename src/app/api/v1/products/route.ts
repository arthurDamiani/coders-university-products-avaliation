import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createProductSchema } from "@/lib/validations/product";
import { listProductsQuerySchema } from "@/lib/validations/products";

type Cursor = {
	created_at: string;
	id: string;
};

function encodeCursor(cursor: Cursor) {
	return Buffer.from(JSON.stringify(cursor), "utf-8").toString("base64url");
}

function decodeCursor(value: string): Cursor | null {
	try {
		const decoded = JSON.parse(
			Buffer.from(value, "base64url").toString("utf-8"),
		);

		if (
			typeof decoded?.created_at === "string" &&
			typeof decoded?.id === "string"
		) {
			return decoded;
		}

		return null;
	} catch {
		return null;
	}
}

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);

	const parsed = listProductsQuerySchema.safeParse({
		cursor: searchParams.get("cursor") ?? undefined,
		limit: searchParams.get("limit") ?? undefined,
	});

	if (!parsed.success) {
		return NextResponse.json(
			{
				message: "Invalid pagination parameters.",
				errors: parsed.error.flatten().fieldErrors,
			},
			{ status: 400 },
		);
	}

	const { cursor, limit } = parsed.data;

	const supabase = createSupabaseServerClient();

	let query = supabase
		.from("products")
		.select(
			"id, score, name, description, external_link, image_url, created_at",
		)
		.order("created_at", { ascending: false })
		.order("id", { ascending: false })
		.limit(limit + 1);

	if (cursor) {
		const decoded = decodeCursor(cursor);

		if (!decoded) {
			return NextResponse.json(
				{ message: "Invalid pagination cursor." },
				{ status: 400 },
			);
		}

		query = query.or(
			`created_at.lt.${decoded.created_at},and(created_at.eq.${decoded.created_at},id.lt.${decoded.id})`,
		);
	}

	const { data, error } = await query;

	if (error) {
		return NextResponse.json(
			{ message: "Could not load products. Please try again." },
			{ status: 500 },
		);
	}

	const items = data.slice(0, limit);
	const hasNextPage = data.length > limit;
	const last = items.at(-1);

	const nextCursor =
		hasNextPage && last
			? encodeCursor({ created_at: last.created_at, id: last.id })
			: null;

	return NextResponse.json({ items, nextCursor }, { status: 200 });
}

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

	const parsed = createProductSchema.safeParse(body);

	if (!parsed.success) {
		return NextResponse.json(
			{
				message: "Invalid data.",
				errors: parsed.error.flatten().fieldErrors,
			},
			{ status: 400 },
		);
	}

	const { name, link, image } = parsed.data;

	const supabase = createSupabaseServerClient();

	const { error } = await supabase.from("products").insert({
		id: nanoid(),
		name,
		external_link: link,
		image_url: image,
		score: 0,
	});

	if (error) {
		return NextResponse.json(
			{ message: "Could not create product. Please try again." },
			{ status: 500 },
		);
	}

	return NextResponse.json(
		{ message: "Product created successfully." },
		{ status: 201 },
	);
}
