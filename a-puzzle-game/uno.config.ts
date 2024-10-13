import { defineConfig, presetIcons, presetUno, presetWebFonts } from "unocss";

export default defineConfig({
	shortcuts: [
		["icon-btn", "border-none bg-transparent rounded-lg cursor-pointer"],
	],
	presets: [
		presetUno(),
		presetIcons({
			scale: 2,
			warn: true,
			extraProperties: {
				display: "inline-block",
				"vertical-align": "middle",
			},
		}),
		presetWebFonts({
			fonts: {
				sans: "DM Sans",
				serif: "DM Serif Display",
				mono: "DM Mono",
			},
		}),
	],
	theme: {
		colors: {
			primary: {
				50: "#EEF6F6",
				100: "#DDEEEE",
				200: "#B8DBDB",
				300: "#97C9C9",
				400: "#75B8B8",
				500: "#54A3A3",
				600: "#448383",
				700: "#326262",
				800: "#214040",
				900: "#112222",
				950: "#091111",
			},
		},
	},
});
