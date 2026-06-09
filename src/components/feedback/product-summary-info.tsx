import Image from "next/image";

type ProductSummaryInfoProps = {
	product: {
		name: string;
		description: string | null;
		score: number;
		image_url: string;
		external_link: string;
	};
};

export function ProductSummaryInfo({ product }: ProductSummaryInfoProps) {
	return (
		<div className="flex gap-4">
			<Image
				src={product.image_url}
				alt={product.name}
				width={96}
				height={96}
				unoptimized
				className="size-24 shrink-0 rounded-md object-cover ring-1 ring-white/10"
			/>

			<div className="min-w-0 space-y-1.5">
				<h1 className="text-balance font-semibold text-lg text-zinc-50 tracking-tight">
					{product.name}
				</h1>
				<span className="inline-block text-emerald-400 text-xs">
					{"//"} score {product.score}
				</span>
				<p className="text-pretty text-sm text-zinc-500 leading-relaxed">
					{product.description ?? "No description available."}
				</p>
				<a
					href={product.external_link}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-block text-sky-400 text-xs underline-offset-4 hover:underline"
				>
					{product.external_link}
				</a>
			</div>
		</div>
	);
}
