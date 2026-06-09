"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type UseFormRegisterReturn, useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import {
	type ProductFeedbackInput,
	productFeedbackSchema,
} from "@/lib/validations/product-feedback";

type FieldRowProps = {
	id: string;
	label: string;
	type?: string;
	hint?: string;
	error?: string;
	register: UseFormRegisterReturn;
};

function FieldRow({
	id,
	label,
	type = "text",
	hint,
	error,
	register,
}: FieldRowProps) {
	return (
		<div className="space-y-1.5">
			<label
				htmlFor={id}
				className="flex items-center gap-1.5 text-sm text-zinc-400"
			>
				<span className="text-zinc-600">$</span>
				<span className={error ? "text-red-400" : "text-zinc-400"}>
					{label}
				</span>
			</label>
			<div className="flex items-center gap-2">
				<span aria-hidden className="text-emerald-400/70 text-sm">
					{">"}
				</span>
				<input
					id={id}
					type={type}
					aria-invalid={!!error}
					className={cn(
						"w-full border-0 border-zinc-800 border-b bg-transparent py-1.5 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-700",
						"focus:border-emerald-400/70",
						error && "border-red-500/60 focus:border-red-400",
					)}
					{...register}
				/>
			</div>
			{hint && !error && (
				<p className="pl-[1.4rem] text-xs text-zinc-600">
					{"// "}
					{hint}
				</p>
			)}
			{error && (
				<p className="flex items-center gap-1.5 pl-[1.4rem] text-red-400 text-xs">
					<span aria-hidden>✗</span> {error}
				</p>
			)}
		</div>
	);
}

type FeedbackFormProps = {
	productId: string;
};

export function FeedbackForm({ productId }: FeedbackFormProps) {
	const router = useRouter();
	const [serverError, setServerError] = useState<string | null>(null);

	const form = useForm<ProductFeedbackInput>({
		resolver: zodResolver(productFeedbackSchema),
		defaultValues: {
			score: undefined,
			comment: "",
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = form;

	async function onSubmit(values: ProductFeedbackInput) {
		setServerError(null);

		try {
			const response = await fetch(`/api/v1/product-feedback/${productId}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			if (!response.ok) {
				const data = await response.json().catch(() => null);
				setServerError(
					data?.message ??
						"Could not submit feedback. Please try again.",
				);
				return;
			}

			router.push(`/products/feedback/${productId}/success`);
		} catch {
			setServerError("Could not connect to the server. Please try again.");
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
			{serverError && (
				<div className="flex items-start gap-2 rounded border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-red-300 text-sm">
					<span aria-hidden className="mt-px">
						✗
					</span>
					<div>
						<p className="font-medium text-red-300">
							Error: feedback submission failed
						</p>
						<p className="text-red-400/80 text-xs">{serverError}</p>
					</div>
				</div>
			)}

			<FieldRow
				id="score"
				label="score"
				type="number"
				hint="score from 1 to 5"
				error={errors.score?.message}
				register={register("score", { valueAsNumber: true })}
			/>

			<div className="space-y-1.5">
				<label
					htmlFor="comment"
					className="flex items-center gap-1.5 text-sm text-zinc-400"
				>
					<span className="text-zinc-600">$</span>
					<span className={errors.comment ? "text-red-400" : "text-zinc-400"}>
						comment
					</span>
				</label>
				<div className="flex items-start gap-2">
					<span aria-hidden className="text-emerald-400/70 text-sm">
						{">"}
					</span>
					<textarea
						id="comment"
						rows={4}
						aria-invalid={!!errors.comment}
						className={cn(
							"w-full resize-none border-0 border-zinc-800 border-b bg-transparent py-1.5 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-700",
							"focus:border-emerald-400/70",
							errors.comment && "border-red-500/60 focus:border-red-400",
						)}
						{...register("comment")}
					/>
				</div>
				{errors.comment && (
					<p className="flex items-center gap-1.5 pl-[1.4rem] text-red-400 text-xs">
						<span aria-hidden>✗</span> {errors.comment.message}
					</p>
				)}
			</div>

			<button
				type="submit"
				disabled={isSubmitting}
				className={cn(
					"group flex w-full items-center justify-center gap-2 rounded border border-emerald-400/30 bg-emerald-400/10 py-2.5 text-emerald-300 text-sm transition-colors",
					"hover:border-emerald-400/60 hover:bg-emerald-400/15",
					"disabled:cursor-not-allowed disabled:opacity-50",
				)}
			>
				<span aria-hidden className="text-emerald-400/60">
					$
				</span>
				{isSubmitting
					? "running ./submit-feedback..."
					: "./submit-feedback --confirm"}
			</button>
		</form>
	);
}
