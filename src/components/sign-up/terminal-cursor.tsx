import { cn } from "@/lib/utils";

export function TerminalCursor({ className }: { className?: string }) {
	return (
		<span
			aria-hidden
			className={cn(
				"animate-terminal-blink inline-block h-[1.1em] w-[0.55em] translate-y-[0.15em] bg-emerald-400",
				className,
			)}
		/>
	);
}
