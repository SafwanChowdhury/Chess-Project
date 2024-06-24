import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
	root: path.resolve(__dirname, "./"),
	base: "/",
	server: {
		port: 3000,
		open: true,
		cors: true
	},
	build: {
		outDir: "dist",
		sourcemap: true,
		assetsDir: "assets",
		rollupOptions: {
			input: {
				main: path.resolve(__dirname, "index.html"),
				game: path.resolve(__dirname, "game.html"),
				about: path.resolve(__dirname, "about.html"),
				local: path.resolve(__dirname, "local.html"),
				popup: path.resolve(__dirname, "popup.html")
			}
		}
	},
	// Removed resolve.alias configuration
});
