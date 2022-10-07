import { de, fr, pt } from "date-fns/locale";
import { getFirstDay, getLocale } from "@nextcloud/l10n";

export class Helpers {
	// Helps replacing a SSR node with a Svelte component
	static replaceNode(node) {
		if (node) {
			node.innerHTML = "";
		}
		return node;
	}

	static hideFallbacks(fileName) {
		const nodes = document.querySelectorAll(`[data-svelte-hide="${fileName}"]`);
		if (nodes && nodes.length) {
			nodes.forEach((node) => node.remove());
		}
	}

	// Returns a new url with updated fields
	static getUpdatedFilterUrl(field, value, baseUrl) {
		const urlParts = baseUrl.split("?");
		if (urlParts.length > 1) {
			const queryString = urlParts[1];
			const queryStringParts = queryString.split("&");
			let queryStringVariables = {};
			queryStringParts.forEach((part) => {
				const partParts = part.split("=");
				if (partParts && partParts.length > 1 && typeof partParts[1] !== "undefined") {
					queryStringVariables = {
						...queryStringVariables,
						[partParts[0]]: partParts[1],
					};
				}
			});
			queryStringVariables[field] = value;

			return `${urlParts[0]}?${Object.keys(queryStringVariables)
				.map((key) => `${key}=${queryStringVariables[key]}`)
				.join("&")}`;
		} else {
			return `${baseUrl}?${field}=${value}`;
		}
	}

	static getLinkEl() {
		return document.querySelector(".hidden-filter-link");
	}

	static getDateLocaleOptions() {
		const shortLocale = getLocale().split("_")[0];
		const locales = { de, fr, pt };
		return { weekStartsOn: getFirstDay(), locale: locales[shortLocale] };
	}

	static calculateDuration(startTime, endTime) {
		if (!startTime || !endTime) return undefined;

		// Make sure, endTime is after startTime
		var startDate = new Date("2000/01/01 " + startTime);
		var endDate = new Date("2000/01/01 " + endTime);
		// If endTime < startTime, endTime shall be on the next day
		if (endDate < startDate) endDate.setTime(endDate.getTime() + 1000 * 60 * 60 * 24);

		// Diff in ms
		var diff = Math.abs(endDate - startDate);

		// In hours
		diff = diff / 1000 / 60 / 60;

		return Math.round((diff + Number.EPSILON) * 100) / 100;
	}

	// NOTE: As this methods returns the 'HH:mm' value only, durations >= 24h will be ignored
	static calculateEndTime(startTime, duration) {
		if (!startTime || duration === "" || duration === undefined) return undefined;

		// Start time in ms
		var endTime = new Date("2000/01/01 " + startTime).getTime();

		// Add duration converted to ms
		endTime += duration * 60 * 60 * 1000;

		return new Date(endTime).toTimeString().substring(0, 5);
	}
}
