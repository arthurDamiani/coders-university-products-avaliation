import Link from "next/link";

import { getCurrentAccount } from "@/lib/auth/session";
import { jetbrainsMono } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export async function Header() {
	const account = await getCurrentAccount();

	return (
		<header
			className={cn(
				jetbrainsMono.className,
				"border-zinc-800 border-b bg-[#0a0c0a] text-zinc-100",
			)}
		>
			<div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
				<Link
					href="/"
					className="flex items-center gap-2 text-sm text-zinc-400"
				>
					<span className="text-emerald-400">coders@university</span>
					<span className="text-zinc-600">:</span>
					<span className="text-sky-400">~</span>
					<span className="text-zinc-600">$</span>
				</Link>

				{account ? (
					<div className="flex items-center gap-3">
						{/* biome-ignore lint/performance/noImgElement: avatar mock via Dicebear (SVG remoto) */}
						<img
							src={`https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(account.email)}`}
							alt=""
							aria-hidden
							className="size-9 rounded-full border border-zinc-800 bg-zinc-900"
						/>
						<div className="leading-tight">
							<p className="text-sm text-zinc-200">
								{account.first_name} {account.last_name}
							</p>
							<p className="text-xs text-zinc-500">{account.email}</p>
						</div>
					</div>
				) : (
					<Link
						href="/auth/sign-in"
						className={cn(
							"group flex items-center gap-2 rounded border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-emerald-300 text-sm transition-colors",
							"hover:border-emerald-400/60 hover:bg-emerald-400/15",
						)}
					>
						<span aria-hidden className="text-emerald-400/60">
							$
						</span>
						./sign-in
					</Link>
				)}
			</div>
		</header>
	);
}
