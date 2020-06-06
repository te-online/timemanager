import svelte from "rollup-plugin-svelte";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";

export default {
	input: "js/main.js",
	output: {
		file: "js/bundle.js",
		format: "iife",
	},
	plugins: [svelte({}), babel({ extensions: [".js", ".svelte"] }), resolve(), commonjs()],
};
