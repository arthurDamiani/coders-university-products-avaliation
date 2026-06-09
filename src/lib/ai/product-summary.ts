import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mastra } from "@/mastra";

type Feedback = {
	score: number;
	comment: string;
	created_at: string;
};

export type ProductSummary = {
	summary: string;
	generatedAt: string;
} | null;

function buildPrompt(feedbacks: Feedback[]) {
	const lines = feedbacks.map(
		(feedback, index) =>
			`${index + 1}. Score ${feedback.score}/5: "${feedback.comment}"`,
	);

	return [
		"Here are the most recent reviews for this product:",
		"",
		...lines,
		"",
		"Summarize these reviews according to your instructions.",
	].join("\n");
}

async function generateSummary(feedbacks: Feedback[]) {
	const agent = mastra.getAgentById("product-feedback-summary-agent");
	const response = await agent.generate(buildPrompt(feedbacks));

	return response.text.trim();
}

/**
 * Returns the AI summary cached in `products.ai_summary` when it still covers
 * the latest feedback; otherwise generates a new summary via Mastra, persists
 * the cache and returns it. On generation failure (e.g. missing API key),
 * falls back to the existing cache if available.
 */
export async function getOrGenerateProductSummary(
	productId: string,
): Promise<ProductSummary> {
	const supabase = createSupabaseServerClient();

	const [{ data: product }, { data: feedbacks }] = await Promise.all([
		supabase
			.from("products")
			.select("ai_summary, ai_summary_generated_at")
			.eq("id", productId)
			.maybeSingle(),
		supabase
			.from("products_feedbacks")
			.select("score, comment, created_at")
			.eq("product_id", productId)
			.order("created_at", { ascending: false })
			.limit(50),
	]);

	if (!feedbacks || feedbacks.length === 0) {
		return null;
	}

	const cached: ProductSummary =
		product?.ai_summary && product?.ai_summary_generated_at
			? {
					summary: product.ai_summary,
					generatedAt: product.ai_summary_generated_at,
				}
			: null;

	const latestFeedbackAt = new Date(feedbacks[0].created_at).getTime();
	const isCacheFresh =
		cached !== null &&
		new Date(cached.generatedAt).getTime() >= latestFeedbackAt;

	if (isCacheFresh) {
		return cached;
	}

	try {
		const summary = await generateSummary(feedbacks);
		const generatedAt = new Date().toISOString();

		await supabase
			.from("products")
			.update({ ai_summary: summary, ai_summary_generated_at: generatedAt })
			.eq("id", productId);

		return { summary, generatedAt };
	} catch {
		return cached;
	}
}
