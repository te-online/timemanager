import { de, fr, pt } from "date-fns/locale";
import { getFirstDay, getLocale } from "@nextcloud/l10n";
import { addMinutes, differenceInMinutes, parse } from "date-fns";

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
			queryStringVariables.timezone = Helpers.getTimezone();

			return `${urlParts[0]}?${Object.keys(queryStringVariables)
				.map((key) => `${key}=${queryStringVariables[key]}`)
				.join("&")}`;
		} else {
			if (field === "timezone") {
				return `${baseUrl}?${field}=${value}`;
			} else {
				return `${baseUrl}?${field}=${value}&timezone=${Helpers.getTimezone()}`;
			}
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
		const start = parse(startTime, "HH:mm", new Date(), this.getDateLocaleOptions());
		const end = parse(endTime, "HH:mm", new Date(), this.getDateLocaleOptions());
		const duration = Math.max(0, this.simpleRounding(differenceInMinutes(end, start) / 60));
		if (isNaN(duration)) {
			return 0;
		}
		return duration;
	}

	static normalizeDuration(duration) {
		if (!duration) {
			return duration;
		}

		const value = `${duration}`;
		let normalizedValue = value.replace(/[^0-9.,]*/g, "");

		// Replace decimal comma with dot
		normalizedValue = normalizedValue.replace(/,/g, ".");
		// Remove duplicate decimal dots
		if (normalizedValue.includes(".")) {
			const partsArray = normalizedValue.split(".");
			const [wholeNumber] = partsArray;
			partsArray.shift();
			normalizedValue = `${wholeNumber}.${partsArray.join("")}`;

			if (value.endsWith(".") && partsArray.length <= 1) {
				return duration;
			}
		}

		return normalizedValue;
	}

	static convertTimeDurationToDecimals(duration) {
		if (!duration) {
			return duration;
		}

		const value = `${duration}`;
		const [hours, minutes] = value.split(":");
		let decimal = +hours;

		if (minutes) {
			decimal += this.simpleRounding(minutes / 60);
		}

		return decimal;
	}

	static convertDecimalsToTimeDuration(timeDuration) {
		if (!timeDuration) {
			return timeDuration;
		}

		const [hoursDecimal, minutesDecimal] = (timeDuration + "").split('.');
		const minutesMultiplier = parseFloat(`0.${minutesDecimal}`).toFixed(2);
		let minutes = this.simpleRounding(minutesMultiplier * 60).toFixed(0);

		if (minutes < 10) {
			minutes = `0${minutes}`;
		}

		let hours = +hoursDecimal;
		if (hours < 10) {
			hours = `0${hours}`;
		}

		return `${hours}:${minutes}`;
	}

	// NOTE: As this method returns the 'HH:mm' value only, durations >= 24h will be ignored
	static calculateEndTime(startTime, duration) {
		if (!startTime || !duration) {
			return undefined;
		}

		const start = parse(startTime, "HH:mm", new Date(), this.getDateLocaleOptions()).getTime();

		return addMinutes(start, Math.round(duration * 60))
			.toTimeString()
			.substring(0, 5);
	}

	static toUTC(date) {
		date.setTime(date.getTime() + date.getTimezoneOffset() * 60000);
		return date;
	}

	static simpleRounding(number) {
		return Math.round(number * 100) / 100;
	}

	static getTimezone() {
		return Intl.DateTimeFormat().resolvedOptions().timeZone;
	}
}
