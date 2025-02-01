import type { SearchEngine } from "../types/SearchEngine";

export const searchEngines: SearchEngine[] = [
	{
		icon: "mdi-google",
		name: "Google",
		url: "https://www.google.com/search?q=",
	},
	{
		icon: "mdi-microsoft-bing",
		name: "Bing",
		url: "https://www.bing.com/search?q=",
	},
	{
		icon: "icons/perplexity.png",
		name: "Perplexity",
		url: "https://www.perplexity.ai/search?q=",
	},
];