import svelte from "rollup-plugin-svelte";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import analyze from "rollup-plugin-analyzer";
import injectProcessEnv from "rollup-plugin-inject-process-env";

export default {
	input: "js/main.js",
	output: {
		file: "js/bundle.js",
		format: "iife",
		external: ["@popperjs/core"],
	},
	plugins: [
		svelte({
			// Emit CSS as "files" for other plugins to process. default is true
			emitCss: false,
		}),
		babel({ extensions: [".js", ".svelte"] }),
		resolve(),
		commonjs(),
		injectProcessEnv({
			NODE_ENV: "production",
		}),
		analyze({ summaryOnly: true }),
	],
};
