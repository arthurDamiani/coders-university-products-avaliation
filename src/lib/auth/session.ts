import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export const SESSION_COOKIE_NAME = "session_token";

const SESSION_DURATION = "7d";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

type Account = {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
};

function getSessionSecret() {
	const secret = process.env.SESSION_SECRET;

	if (!secret) {
		throw new Error("Missing environment variable: SESSION_SECRET is required");
	}

	return new TextEncoder().encode(secret);
}

export async function createSessionToken(account: Pick<Account, "id">) {
	return new SignJWT({ sub: account.id })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(SESSION_DURATION)
		.sign(getSessionSecret());
}

export async function setSessionCookie(token: string) {
	const cookieStore = await cookies();

	cookieStore.set(SESSION_COOKIE_NAME, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: SESSION_MAX_AGE_SECONDS,
	});
}

export async function getCurrentAccount(): Promise<Account | null> {
	const cookieStore = await cookies();
	const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

	if (!token) {
		return null;
	}

	let accountId: string | undefined;

	try {
		const { payload } = await jwtVerify(token, getSessionSecret());
		accountId = typeof payload.sub === "string" ? payload.sub : undefined;
	} catch {
		return null;
	}

	if (!accountId) {
		return null;
	}

	const supabase = createSupabaseServerClient();

	const { data, error } = await supabase
		.from("accounts")
		.select("id, first_name, last_name, email")
		.eq("id", accountId)
		.maybeSingle();

	if (error || !data) {
		return null;
	}

	return data;
}
