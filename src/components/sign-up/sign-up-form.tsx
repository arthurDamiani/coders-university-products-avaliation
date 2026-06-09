"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type UseFormRegisterReturn, useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { type SignUpInput, signUpSchema } from "@/lib/validations/sign-up";

type FieldRowProps = {
	id: string;
	label: string;
	type?: string;
	autoComplete?: string;
	hint?: string;
	error?: string;
	register: UseFormRegisterReturn;
};

function FieldRow({
	id,
	label,
	type = "text",
	autoComplete,
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
					autoComplete={autoComplete}
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

export function SignUpForm() {
	const router = useRouter();
	const [serverError, setServerError] = useState<string | null>(null);

	const form = useForm<SignUpInput>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			first_name: "",
			last_name: "",
			email: "",
			password: "",
			confirm_password: "",
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = form;

	async function onSubmit(values: SignUpInput) {
		setServerError(null);

		try {
			const response = await fetch("/api/v1/sign-up", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			if (!response.ok) {
				const data = await response.json().catch(() => null);
				setServerError(
					data?.message ?? "Could not create account. Please try again.",
				);
				return;
			}

			router.push("/auth/sign-up/success");
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
							Error: account creation failed
						</p>
						<p className="text-red-400/80 text-xs">{serverError}</p>
					</div>
				</div>
			)}

			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
				<FieldRow
					id="first_name"
					label="first_name"
					autoComplete="given-name"
					error={errors.first_name?.message}
					register={register("first_name")}
				/>
				<FieldRow
					id="last_name"
					label="last_name"
					autoComplete="family-name"
					error={errors.last_name?.message}
					register={register("last_name")}
				/>
			</div>

			<FieldRow
				id="email"
				label="email"
				type="email"
				autoComplete="email"
				error={errors.email?.message}
				register={register("email")}
			/>

			<FieldRow
				id="password"
				label="password"
				type="password"
				autoComplete="new-password"
				hint="minimum 8 characters"
				error={errors.password?.message}
				register={register("password")}
			/>

			<FieldRow
				id="confirm_password"
				label="confirm_password"
				type="password"
				autoComplete="new-password"
				error={errors.confirm_password?.message}
				register={register("confirm_password")}
			/>

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
					? "running ./create-account..."
					: "./create-account --confirm"}
			</button>
		</form>
	);
}
