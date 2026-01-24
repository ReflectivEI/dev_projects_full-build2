import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import sourceMapperPlugin from "./source-mapper/src/index";
import { devToolsPlugin } from "./dev-tools/src/vite-plugin";
import { fullStoryPlugin } from "./fullstory-plugin";
import apiRoutes from "vite-plugin-api-routes";

const allowedHosts: string[] = [];
if (process.env.FRONTEND_DOMAIN) {
	allowedHosts.push(
		process.env.FRONTEND_DOMAIN,
		`http://${process.env.FRONTEND_DOMAIN}`,
		`https://${process.env.FRONTEND_DOMAIN}`,
	);
}
if (process.env.ALLOWED_ORIGINS) {
	allowedHosts.push(...process.env.ALLOWED_ORIGINS.split(","));
}
if (process.env.VITE_PARENT_ORIGIN) {
	allowedHosts.push(process.env.VITE_PARENT_ORIGIN);
}
if (allowedHosts.length === 0) {
	allowedHosts.push("*");
}

export default defineConfig(({ mode, command }) => {
	// For production builds, skip API routes plugin (GitHub Pages doesn't need it)
	const isStaticBuild = command === 'build' && process.env.STATIC_BUILD === 'true';
	
	const plugins = [
		react({
			babel: {
				plugins: [sourceMapperPlugin],
			},
		}),
	];
	
	// Only add API routes plugin if not building for static hosting
	if (!isStaticBuild) {
		plugins.push(
			apiRoutes({
				mode: "isolated",
				configure: "src/server/configure.js",
				dirs: [{ dir: "./src/server/api", route: "" }],
				forceRestart: mode === "development",
			})
		);
	}
	
	// Add dev tools only in development
	if (mode === "development") {
		plugins.push(devToolsPlugin() as Plugin, fullStoryPlugin());
	}
	
		return {
			plugins,

			resolve: {
				alias: {
					nothing: "/src/fallbacks/missingModule.ts",
					"@/api": path.resolve(__dirname, "./src/server/api"),
					"@": path.resolve(__dirname, "./src"),
				},
			},

			server: {
				host: "0.0.0.0",
				port: parseInt(process.env.PORT || "5173"),
				strictPort: !!process.env.PORT,
				allowedHosts,
				cors: {
					origin: allowedHosts,
					credentials: true,
					methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
					allowedHeaders: ["Content-Type", "Authorization", "Accept", "User-Agent"],
				},
				hmr: {
					overlay: false,
				},
			},

		build: {
			rollupOptions: {
				// No external dependencies - bundle everything
			},
		},

		// Set base path based on deployment target
		// GitHub Pages needs /dev_projects_full-build2/
		// Cloudflare Pages needs /
		base: process.env.GITHUB_PAGES === 'true' ? '/dev_projects_full-build2/' : '/',
		};
	});

// Force rebuild: 2026-01-24T09:06:30.958Z
