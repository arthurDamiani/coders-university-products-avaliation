"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { type Product, ProductCard } from "@/components/products/product-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type ProductsPage = {
	items: Product[];
	nextCursor: string | null;
};

async function fetchProducts(cursor?: string): Promise<ProductsPage> {
	const params = new URLSearchParams();

	if (cursor) {
		params.set("cursor", cursor);
	}

	const response = await fetch(`/api/v1/products?${params.toString()}`);

	if (!response.ok) {
		throw new Error("Could not load products.");
	}

	return response.json();
}

export function ProductsList() {
	const sentinelRef = useRef<HTMLDivElement>(null);

	const {
		data,
		error,
		isError,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["products"],
		queryFn: ({ pageParam }) => fetchProducts(pageParam),
		initialPageParam: undefined as string | undefined,
		getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
	});

	useEffect(() => {
		const sentinel = sentinelRef.current;

		if (!sentinel || !hasNextPage) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting) {
					fetchNextPage();
				}
			},
			{ rootMargin: "200px" },
		);

		observer.observe(sentinel);

		return () => observer.disconnect();
	}, [fetchNextPage, hasNextPage]);

	if (isError) {
		return (
			<Alert variant="destructive">
				<AlertTitle>Error loading products</AlertTitle>
				<AlertDescription>
					{error instanceof Error
						? error.message
						: "Something went wrong while fetching products. Please try again."}
				</AlertDescription>
			</Alert>
		);
	}

	const products = data?.pages.flatMap((page) => page.items) ?? [];

	if (isLoading) {
		return <p className="text-sm text-zinc-500">Loading products...</p>;
	}

	if (products.length === 0) {
		return <p className="text-sm text-zinc-500">No products found.</p>;
	}

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{products.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>

			<div ref={sentinelRef} aria-hidden className="h-1" />

			{isFetchingNextPage && (
				<p className="text-center text-sm text-zinc-500">
					Loading more products...
				</p>
			)}
		</div>
	);
}
