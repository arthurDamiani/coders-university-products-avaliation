import type { Metadata } from "next";

import { ProductsList } from "@/components/products/products-list";
import { jetbrainsMono } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
	title: "Products",
};

export default function Home() {
	return (
		<main
			className={cn(
				jetbrainsMono.className,
				"relative flex flex-1 flex-col overflow-hidden bg-[#0a0c0a] px-6 py-16 text-zinc-100",
			)}
		>
			<div
				aria-hidden
				className="-z-10 absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black_45%,transparent_100%)]"
			/>
			<div
				aria-hidden
				className="-z-10 absolute top-0 left-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-emerald-500/10 blur-[140px]"
			/>

			<div className="mx-auto w-full max-w-6xl space-y-8">
				<div className="space-y-1.5">
					<p className="flex flex-wrap items-center gap-x-2 text-sm text-zinc-500">
						<span className="text-emerald-400">coders@university</span>
						<span className="text-zinc-600">:</span>
						<span className="text-sky-400">~/products</span>
						<span className="text-zinc-600">$</span>
						<span className="text-zinc-300">./list-products.sh</span>
					</p>
					<h1 className="text-balance font-semibold text-lg text-zinc-50 tracking-tight">
						<span className="text-emerald-400">{"//"}</span> Products
					</h1>
					<p className="text-pretty text-sm text-zinc-500 leading-relaxed">
						Explore the available products and click on one to leave your
						feedback.
					</p>
				</div>

				<ProductsList />
			</div>
		</main>
	);
}
