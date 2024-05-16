import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
	plugins: [
		solidPlugin(),
		VitePWA({
			workbox: {
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/cdn\.communitydragon\.org\/.*/i,
						handler: "CacheFirst",
						options: {
							cacheName: "static-image-assets",
							expiration: {
								maxEntries: 64,
								maxAgeSeconds: 24 * 60 * 60, // 24 hours
							},
						},
					},
				],
			},
			registerType: "autoUpdate",
			includeAssets: [
				"favicon.svg",
				"favicon.ico",
				"robots.txt",
				"apple-touch-icon.png",
			],
			manifest: {
				name: "League Chest Hunter",
				short_name: "League Chest Hunter",
				description: "View available chests for your champions",
				theme_color: "#115577",
				icons: [
					{
						src: "/android-chrome-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "/android-chrome-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
					{
						src: "/android-chrome-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any maskable",
					},
				],
			},
		}),
	],
	server: {
		port: 5173,
	},
	build: {
		target: "esnext",
	},
});
