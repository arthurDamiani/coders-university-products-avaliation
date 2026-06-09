import { Mastra } from "@mastra/core";

import { productFeedbackSummaryAgent } from "@/mastra/agents/product-feedback-summary-agent";

export const mastra = new Mastra({
	agents: { productFeedbackSummaryAgent },
});
