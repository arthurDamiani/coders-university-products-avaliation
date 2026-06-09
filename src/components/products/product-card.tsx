"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export type Product = {
	id: string;
	name: string;
	description: string | null;
	score: number;
	external_link: string;
	image_url: string;
};

type ProductCardProps = {
	product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
	const router = useRouter();

	return (
		<Card
			role="button"
			tabIndex={0}
			onClick={() => router.push(`/products/feedback/${product.id}`)}
			onKeyDown={(event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					router.push(`/products/feedback/${product.id}`);
				}
			}}
			className="group cursor-pointer border border-zinc-800 bg-zinc-950/70 ring-1 ring-white/5 transition-colors hover:border-emerald-500/40 hover:ring-emerald-500/10"
		>
			{/* image_url comes from any external host submitted via POST /api/v1/products,
			    so it's not possible to restrict hosts via images.remotePatterns */}
			<Image
				src={product.image_url}
				alt={product.name}
				width={400}
				height={240}
				unoptimized
				className="aspect-[5/3] w-full object-cover"
			/>

			<CardHeader>
				<CardTitle className="text-zinc-100">{product.name}</CardTitle>
				<span className="text-emerald-400 text-xs">
					{"//"} score {product.score}
				</span>
			</CardHeader>

			<CardContent>
				<CardDescription className="line-clamp-2 text-zinc-500">
					{product.description ?? "No description available."}
				</CardDescription>
			</CardContent>
		</Card>
	);
}
