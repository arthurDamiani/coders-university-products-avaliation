import Link from "next/link";

import { TerminalCursor } from "@/components/sign-up/terminal-cursor";
import { cn } from "@/lib/utils";

export function AuthRequiredBlock() {
	return (
		<div className="space-y-5 p-6 sm:p-8">
			<div className="space-y-1.5">
				<h1 className="flex items-center gap-2 text-balance font-semibold text-lg text-zinc-50 tracking-tight">
					<span className="text-emerald-400">{"//"}</span> Authentication
					required
				</h1>
				<p className="text-pretty text-sm text-zinc-500 leading-relaxed">
					You need to be authenticated on the platform to submit a review for
					this product. Sign in to your account to continue.
				</p>
			</div>

			<div className="flex items-center gap-1.5 rounded border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-amber-300 text-sm">
				<span aria-hidden className="mt-px">
					!
				</span>
				<p>
					Session not found{" "}
					<span className="text-amber-400/70">— sign in to continue</span>
				</p>
			</div>

			<Link
				href="/auth/sign-in"
				className={cn(
					"group flex w-full items-center justify-center gap-2 rounded border border-emerald-400/30 bg-emerald-400/10 py-2.5 text-emerald-300 text-sm transition-colors",
					"hover:border-emerald-400/60 hover:bg-emerald-400/15",
				)}
			>
				<span aria-hidden className="text-emerald-400/60">
					$
				</span>
				./sign-in --redirect
			</Link>

			<p className="flex items-center gap-1.5 text-zinc-600 text-sm">
				<span>waiting for authentication</span>
				<TerminalCursor />
			</p>
		</div>
	);
}
