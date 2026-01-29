import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";
import sourceMapperPlugin from "./source-mapper/src/index";
import { devToolsPlugin } from "./dev-tools/src/vite-plugin";
import { fullStoryPlugin } from "./fullstory-plugin";
import apiRoutes from "vite-plugin-api-routes";

// Plugin to ensure Cloudflare files are copied to dist/client
function copyCloudflareFilesPlugin(): Plugin {
	return {
		name: 'copy-cloudflare-files',
		closeBundle() {
			console.log('[copy-cloudflare-files] Running...');
			const filesToCopy = ['_redirects', '_routes.json', '_worker.js'];
			const destDir = path.resolve(__dirname, 'dist/client');
			
			// Ensure dist/client exists
			if (!fs.existsSync(destDir)) {
				fs.mkdirSync(destDir, { recursive: true });
			}
			
			filesToCopy.forEach(file => {
				const source = path.resolve(__dirname, 'public', file);
				const dest = path.resolve(destDir, file);
				
				if (fs.existsSync(source)) {
					fs.copyFileSync(source, dest);
					console.log(`✅ [copy-cloudflare-files] Copied ${file} to dist/client/`);
				} else {
					console.warn(`⚠️  [copy-cloudflare-files] ${file} not found in public/`);
				}
			});
		},
	};
}

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

export default defineConfig(({ mode }) => ({
	publicDir: 'public',
	plugins: [
		react({
			babel: {
				plugins: [sourceMapperPlugin],
			},
		}),
		apiRoutes({
			mode: "isolated",
			configure: "src/server/configure.js",
			dirs: [{ dir: "./src/server/api", route: "" }],
			forceRestart: mode === "development",
		}),
		...(mode === "development"
			? [devToolsPlugin() as Plugin, fullStoryPlugin()]
			: []),
		copyCloudflareFilesPlugin(),
	],

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
}));
