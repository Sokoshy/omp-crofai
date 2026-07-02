import type { ExtensionFactory } from "@oh-my-pi/pi-coding-agent/extensibility/extensions";

const CROF_MODELS_URL = "https://crof.ai/v1/models";

interface CrofModel {
	id: string;
	name?: string;
	reasoning_effort?: boolean;
	pricing?: {
		prompt?: string;
		completion?: string;
		cache_prompt?: string;
	};
}

interface CrofModelsResponse {
	data: CrofModel[];
}

const createCrofAiProvider: ExtensionFactory = async (pi) => {
	// ── Register the provider with /login support ──
	pi.registerProvider("crof", {
		baseUrl: "https://crof.ai/v1",
		apiKey: "CROF_API_KEY",
		api: "openai-completions",
		authHeader: true,
		oauth: {
			name: "CrofAI",
			login: async (callbacks) => {
				const apiKey = await callbacks.onPrompt({
					message: "Enter your CrofAI API key:",
					placeholder: "sk-crof-...",
				});
				if (!apiKey) return undefined;
				return apiKey;
			},
		},
		fetchDynamicModels: async (apiKey) => {
			// Don't show models until the user has set an API key.
			// apiKey is "CROF_API_KEY" literal when the env var is unset — treat
			// anything matching the literal key name as "no key".
			if (!apiKey || apiKey === "CROF_API_KEY") return [];

			const res = await fetch(CROF_MODELS_URL, {
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${apiKey}`,
				},
			});
			if (!res.ok) return [];
			const { data } = (await res.json()) as CrofModelsResponse;
			return data.map((m) => ({
				id: m.id,
				name: m.name || m.id,
				reasoning: !!m.reasoning_effort,
				input: ["text"] as const,
				cost: {
					input: parseFloat(m.pricing?.prompt ?? "0"),
					output: parseFloat(m.pricing?.completion ?? "0"),
					cacheRead: parseFloat(m.pricing?.cache_prompt ?? "0"),
					cacheWrite: 0,
				},
			}));
		},
	});

	// ── Register the /refresh-crof command ──
	pi.registerCommand("refresh-crof", {
		description: "Force refresh CrofAI models from the API (bypass 24h cache)",
		handler: async (ctx) => {
			ctx.ui.notify("Refreshing CrofAI models...", "info");
			try {
				await ctx.modelRegistry.refreshProvider("crof", "online");
				ctx.ui.notify("CrofAI models refreshed!", "info");
			} catch (err) {
				ctx.ui.notify(
					`Refresh failed: ${err instanceof Error ? err.message : String(err)}`,
					"error",
				);
			}
		},
	});
};

export default createCrofAiProvider;
