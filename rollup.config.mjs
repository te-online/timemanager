import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import analyze from "rollup-plugin-analyzer";
import injectProcessEnv from "rollup-plugin-inject-process-env";
import scss from "rollup-plugin-scss";
import sass from "sass";
import polyfill from "rollup-plugin-polyfill-node";

export default {
	input: "js/main.js",
	output: {
		file: "js/bundle.js",
		format: "iife",
	},
	// external: ["@popperjs/core"],
	plugins: [
		scss({
			// Filename to write all styles to
			output: "css/timemanager.css",
			// A Sass (sass compatible) compiler to use
			// - sass and node-sass packages are picked up automatically
			// - you can use this option to specify custom package (e.g. a fork of one of them)
			sass,
			// Log filename and size of generated CSS files (default: true)
			verbose: true,
			// Add file/folder to be monitored in watch mode so that changes to these files will trigger rebuilds.
			// Do not choose a directory where rollup output or dest is pointed to as this will cause an infinite loop
			watch: "css/*.scss",
		}),
		svelte({
			// Emit CSS as "files" for other plugins to process. default is true
			emitCss: false,
		}),
		babel({ extensions: [".js", ".svelte"] }),
		resolve({
			browser: true,
			exportConditions: ["svelte"],
			extensions: [".js", ".svelte"],
		}),
		commonjs(),
		polyfill(),
		injectProcessEnv({
			NODE_ENV: "production",
		}),
		analyze({ summaryOnly: true }),
	],
};
