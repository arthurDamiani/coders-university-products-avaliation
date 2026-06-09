import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

type AiSummaryCardProps = {
	summary: string;
};

export function AiSummaryCard({ summary }: AiSummaryCardProps) {
	return (
		<div
			className={cn(
				"space-y-2.5 rounded-lg border border-emerald-400/30 bg-emerald-400/[0.06] p-4",
				"shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-400/10",
			)}
		>
			<div className="flex items-center gap-2">
				<span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-1 font-medium text-emerald-300 text-xs uppercase tracking-wide">
					<Sparkles aria-hidden className="size-3.5" />
					AI-generated summary
				</span>
			</div>

			<p className="text-pretty text-sm text-zinc-300 leading-relaxed">
				{summary}
			</p>
		</div>
	);
}
