import { defineConfig } from "cypress";

export default defineConfig({
	viewportWidth: 1280,
	viewportHeight: 800,
	video: false,
	reporter: "junit",
	reporterOptions: {
		mochaFile: "results/TEST-[hash].xml",
	},
	e2e: {
		// We've imported your old cypress plugins here.
		// You may want to clean this up later by importing these.
		setupNodeEvents(on, config) {
			on("before:browser:launch", (browser, launchOptions) => {
				if (browser.family === "firefox") {
					launchOptions.preferences["intl.accept_languages"] = "en-en";
				}
				return launchOptions;
			});

			return require("./cypress/plugins/index.js")(on, config);
		},
	},
});
