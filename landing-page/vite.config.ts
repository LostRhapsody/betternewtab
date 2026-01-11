import { URL, fileURLToPath } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [vue()],

	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},

	server: {
		port: 5175,
		hmr: {
			overlay: true,
		},
	},

	css: {
		devSourcemap: true,
	},

	build: {
		sourcemap: true,
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ["vue", "vue-router"],
				},
			},
		},
	},

	optimizeDeps: {
		include: ["vue", "vue-router"],
	},
});
