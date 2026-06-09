import type { Metadata } from "next";

import { TerminalCursor } from "@/components/sign-up/terminal-cursor";
import { jetbrainsMono } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
	title: "Feedback submitted",
};

const LOG_LINES = [
	{ status: "ok", text: "validate review data" },
	{ status: "ok", text: "confirm account authentication" },
	{ status: "ok", text: "register review in products_feedbacks" },
	{ status: "done", text: "feedback published successfully" },
];

export default function ProductFeedbackSuccessPage() {
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

			<div className="w-full max-w-lg space-y-5">
				<p className="flex flex-wrap items-center gap-x-2 text-sm text-zinc-500">
					<span className="text-emerald-400">coders@university</span>
					<span className="text-zinc-600">:</span>
					<span className="text-sky-400">~/products/feedback</span>
					<span className="text-zinc-600">$</span>
					<span className="text-zinc-300">./review-product.sh</span>
					<span className="text-zinc-600">--status</span>
				</p>

				<div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/70 shadow-2xl shadow-emerald-500/5 ring-1 ring-white/5 backdrop-blur-sm">
					<div className="flex items-center gap-2 border-zinc-800 border-b bg-white/[0.02] px-4 py-3">
						<span className="size-2.5 rounded-full bg-red-500/70" />
						<span className="size-2.5 rounded-full bg-amber-500/70" />
						<span className="size-2.5 rounded-full bg-emerald-500/70" />
						<span className="ml-2 truncate text-xs text-zinc-500">
							~/coders-university/products/feedback.sh — exit 0
						</span>
					</div>

					<div className="space-y-5 p-6 sm:p-8">
						<ul className="space-y-2 text-sm">
							{LOG_LINES.map((line) => (
								<li key={line.text} className="flex items-center gap-2.5">
									<span
										aria-hidden
										className={cn(
											"font-medium",
											line.status === "done"
												? "text-emerald-400"
												: "text-emerald-400/70",
										)}
									>
										{line.status === "done" ? "✓✓" : "✓"}
									</span>
									<span className="text-zinc-400">{line.text}</span>
								</li>
							))}
						</ul>

						<div className="space-y-1.5 border-emerald-400/20 border-t pt-5">
							<h1 className="flex items-center gap-2 text-balance font-semibold text-lg text-zinc-50 tracking-tight">
								<span className="text-emerald-400">{"//"}</span> Feedback
								submitted successfully
							</h1>
							<p className="text-pretty text-sm text-zinc-500 leading-relaxed">
								Thank you for reviewing this product. Your opinion helps other
								community members make better decisions.
							</p>
						</div>

						<p className="flex items-center gap-1.5 text-emerald-400/70 text-sm">
							<span className="text-zinc-600">$</span>
							<span>process complete, waiting for next command</span>
							<TerminalCursor />
						</p>
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
