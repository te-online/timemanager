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
		const start = parse(startTime, "HH:mm", new Date(), this.getDateLocaleOptions());
		const end = parse(endTime, "HH:mm", new Date(), this.getDateLocaleOptions());
		return Math.max(0, this.simpleRounding(differenceInMinutes(end, start) / 60));
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

	// NOTE: As this methods returns the 'HH:mm' value only, durations >= 24h will be ignored
	static calculateEndTime(startTime, duration) {
		if (!startTime || !duration) {
			return undefined;
		}

		const start = parse(startTime, "HH:mm", new Date(), this.getDateLocaleOptions()).getTime();

		return addMinutes(start, duration * 60)
			.toTimeString()
			.substring(0, 5);
	}

	// Uses calculateDatetimeWithTimezone to transform a given UTC date and time into a timezone local date or time
	static calculateToLocalDatetime(date, time, timezone, output = "date" | "time") {
		if (!timezone) timezone = this.getTimezone();

		const datetime = new Date(`${date} ${time}Z`);

		return this.calculateDatetimeWithTimezone(datetime, timezone, output);
	}

	// Uses calculateDatetimeWithTimezone to transform a given date, time and timezone into a UTC date or time
	static calculateToUTCDatetime(date, time, timezone, output = "date" | "time") {
		if (!timezone) timezone = this.getTimezone();

		const datetime = new Date(
			new Date(`${date} ${time}`).toLocaleString("en-US", {
				timezone,
			})
		);

		return this.calculateDatetimeWithTimezone(datetime, "UTC", output);
	}

	// Used by Helpers class only to transform dates and times from UTC to local and vice versa. Depending on output
	// parameter this function either returns "yyyy-MM-DD" or "HH:mm"
	static calculateDatetimeWithTimezone(datetime, timezone, output = "date" | "time") {
		const datetimeFormat =
			output === "date"
				? new Intl.DateTimeFormat(
						"fr-CA", // Returns yyyy-MM-DD
						{
							timeZone: timezone,
							year: "numeric",
							month: "2-digit",
							day: "2-digit",
						}
				  )
				: new Intl.DateTimeFormat(
						"en-US", // Returns HH:mm
						{
							timeZone: timezone,
							hour: "2-digit",
							minute: "2-digit",
							hour12: false,
						}
				  );

		return datetimeFormat.format(datetime);
	}

	// Transforms a UTC date into a local date. Used in main.js to transform all UI-visible dates in
	// times/statistics into local times.
	// To add a date to a php template to be transformed once loaded, add the following code into php:
	// <span data-datetime="<?php p($time->getStartFormatted("Y-m-d H:i:s")); ?>"> ...
	// In main.js transformDatetimeElement replaces all these values with local date values.
	// Returns a localized long date format.
	static formatLocalDate(date, timezone) {
		if (!timezone) timezone = this.getTimezone();

		// Time
		const datetime = new Date(`${date}Z`);

		const datetimeFormat = new Intl.DateTimeFormat("default", {
			timeZone: timezone,
			year: "numeric",
			month: "long",
			day: "2-digit",
			weekday: "long",
		});

		return datetimeFormat.format(datetime);
	}

	// Fetch current timezone. Might be timezone set in nextcloud/calendar settings or by browser.
	static getTimezone() {
		let store;
		try {
			store = JSON.parse(document.querySelector("span[data-store]").getAttribute("data-store"));
		} catch {
			// Failed to find store
		}

		let timezone = undefined;
		if (store && store["settings"] && store["settings"]["timezone"]) {
			const storeTimezone = store["settings"]["timezone"];
			if (storeTimezone && storeTimezone !== "automatic") timezone = storeTimezone;
		}

		if (!timezone) {
			// nextcloud/calendar actually uses jstz to determine the user/browser timezone
			// if no other timezone was defined
			timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		}
		return timezone;
	}

	static simpleRounding(number) {
		return Math.round(number * 100) / 100;
	}
}
