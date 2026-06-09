import { publicProcedure, router } from "@/server/trpc";

export const appRouter = router({
	health: publicProcedure.query(() => ({ status: "ok" }) as const),
});

export type AppRouter = typeof appRouter;
