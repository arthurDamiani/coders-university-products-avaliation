import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { Star } from "lucide-react";

type ProductFeedbackListProps = {
	feedbacks: Array<{
		id: string;
		score: number;
		comment: string;
		created_at: string;
	}>;
};

export function ProductFeedbackList({ feedbacks }: ProductFeedbackListProps) {
	if (feedbacks.length === 0) {
		return (
			<p className="text-sm text-zinc-600">
				{"// "}no reviews yet for this product
			</p>
		);
	}

	return (
		<ul className="space-y-3">
			{feedbacks.map((feedback) => (
				<li
					key={feedback.id}
					className="space-y-1.5 rounded-md border border-zinc-800 bg-white/[0.02] p-3"
				>
					<div className="flex items-center justify-between gap-2">
						<span className="flex items-center gap-1 text-amber-400 text-xs">
							{Array.from({ length: 5 }, (_, index) => (
								<Star
									// biome-ignore lint/suspicious/noArrayIndexKey: fixed positions 1 to 5
									key={index}
									aria-hidden
									className="size-3.5"
									fill={index < feedback.score ? "currentColor" : "none"}
								/>
							))}
						</span>
						<span className="text-xs text-zinc-600">
							{format(new Date(feedback.created_at), "MM/dd/yyyy", {
								locale: enUS,
							})}
						</span>
					</div>
					<p className="text-pretty text-sm text-zinc-400 leading-relaxed">
						{feedback.comment}
					</p>
				</li>
			))}
		</ul>
	);
}
