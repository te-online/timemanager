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
}
