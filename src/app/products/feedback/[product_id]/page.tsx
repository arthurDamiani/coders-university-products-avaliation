import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AiSummaryCard } from "@/components/feedback/ai-summary-card";
import { AuthRequiredBlock } from "@/components/feedback/auth-required-block";
import { FeedbackForm } from "@/components/feedback/feedback-form";
import { ProductFeedbackList } from "@/components/feedback/product-feedback-list";
import { ProductSummaryInfo } from "@/components/feedback/product-summary-info";
import { TerminalCursor } from "@/components/sign-up/terminal-cursor";
import { Separator } from "@/components/ui/separator";
import { getOrGenerateProductSummary } from "@/lib/ai/product-summary";
import { getCurrentAccount } from "@/lib/auth/session";
import { jetbrainsMono } from "@/lib/fonts";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
	title: "Review product",
};

export default async function ProductFeedbackPage({
	params,
}: PageProps<"/products/feedback/[product_id]">) {
	const { product_id } = await params;

	const supabase = createSupabaseServerClient();

	const [account, { data: product }, { data: feedbacks }] = await Promise.all([
		getCurrentAccount(),
		supabase
			.from("products")
			.select("id, name, description, score, image_url, external_link")
			.eq("id", product_id)
			.maybeSingle(),
		supabase
			.from("products_feedbacks")
			.select("id, score, comment, created_at")
			.eq("product_id", product_id)
			.order("created_at", { ascending: false }),
	]);

	if (!product) {
		notFound();
	}

	const aiSummary = await getOrGenerateProductSummary(product_id);

	return (
		<main
			className={cn(
				jetbrainsMono.className,
				"relative flex flex-1 items-center justify-center overflow-hidden bg-[#0a0c0a] px-6 py-16 text-zinc-100",
			)}
		>
			<div
				aria-hidden
				className="-z-10 absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black_45%,transparent_100%)]"
			/>
			<div
				aria-hidden
				className="-z-10 absolute top-1/3 left-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[140px]"
			/>

			<div className="w-full max-w-2xl space-y-5">
				<p className="flex flex-wrap items-center gap-x-2 text-sm text-zinc-500">
					<span className="text-emerald-400">coders@university</span>
					<span className="text-zinc-600">:</span>
					<span className="text-sky-400">~/products/feedback</span>
					<span className="text-zinc-600">$</span>
					<span className="text-zinc-300">
						./review-product.sh --id={product_id}
					</span>
					<TerminalCursor />
				</p>

				<div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/70 shadow-2xl shadow-emerald-500/5 ring-1 ring-white/5 backdrop-blur-sm">
					<div className="flex items-center gap-2 border-zinc-800 border-b bg-white/[0.02] px-4 py-3">
						<span className="size-2.5 rounded-full bg-red-500/70" />
						<span className="size-2.5 rounded-full bg-amber-500/70" />
						<span className="size-2.5 rounded-full bg-emerald-500/70" />
						<span className="ml-2 truncate text-xs text-zinc-500">
							~/coders-university/products/feedback/{product_id}.sh
						</span>
					</div>

					<div className="space-y-6 p-6 sm:p-8">
						<ProductSummaryInfo product={product} />

						<Separator className="bg-zinc-800" />

						{aiSummary && <AiSummaryCard summary={aiSummary.summary} />}

						<div className="space-y-3">
							<h2 className="text-balance font-semibold text-sm text-zinc-50 tracking-tight">
								<span className="text-emerald-400">{"//"}</span> Community
								reviews
							</h2>
							<ProductFeedbackList feedbacks={feedbacks ?? []} />
						</div>

						<Separator className="bg-zinc-800" />

						{account ? (
							<div>
								<div className="mb-6 space-y-1.5">
									<h2 className="text-balance font-semibold text-lg text-zinc-50 tracking-tight">
										<span className="text-emerald-400">{"//"}</span> Review this
										product
									</h2>
									<p className="text-pretty text-sm text-zinc-500 leading-relaxed">
										Share with the community what you thought. Give a score from
										1 to 5 and leave a comment about your experience.
									</p>
								</div>

								<FeedbackForm productId={product_id} />
							</div>
						) : (
							<AuthRequiredBlock />
						)}
					</div>
				</div>

				<p className="text-center text-xs text-zinc-600">
					[ © {new Date().getFullYear()} Coders University — all rights
					reserved ]
				</p>
			</div>
		</main>
	);
}
