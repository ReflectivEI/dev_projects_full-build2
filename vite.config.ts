import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";
import sourceMapperPlugin from "./source-mapper/src/index";
import { devToolsPlugin } from "./dev-tools/src/vite-plugin";
import { fullStoryPlugin } from "./fullstory-plugin";
import apiRoutes from "vite-plugin-api-routes";

// Plugin to ensure _redirects is copied to dist
function copyRedirectsPlugin(): Plugin {
	return {
		name: 'copy-redirects',
		closeBundle() {
			console.log('[copy-redirects] Running...');
			const source = path.resolve(__dirname, 'public/_redirects');
			const dest = path.resolve(__dirname, 'dist/_redirects');
			console.log('[copy-redirects] Source:', source);
			console.log('[copy-redirects] Dest:', dest);
			console.log('[copy-redirects] Source exists?', fs.existsSync(source));
			
			if (fs.existsSync(source)) {
				fs.copyFileSync(source, dest);
				console.log('✅ [copy-redirects] Copied _redirects to dist/');
				console.log('[copy-redirects] Dest exists?', fs.existsSync(dest));
				if (fs.existsSync(dest)) {
					const content = fs.readFileSync(dest, 'utf-8');
					console.log('[copy-redirects] Content:', content);
				}
			} else {
				console.warn('⚠️  [copy-redirects] _redirects not found in public/');
				console.log('[copy-redirects] Listing public/ directory:');
				const publicDir = path.resolve(__dirname, 'public');
				if (fs.existsSync(publicDir)) {
					const files = fs.readdirSync(publicDir);
					console.log('[copy-redirects] Files:', files.join(', '));
				}
			}
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
		copyRedirectsPlugin(),
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
