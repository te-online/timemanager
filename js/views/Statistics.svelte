<script>
	export let statsApiUrl;
	export let requestToken;

	export let controls = true;

	import { onMount } from "svelte";
	import {
		startOfWeek,
		addDays,
		startOfDay,
		endOfDay,
		format,
		isSameDay,
		startOfToday,
		getWeek,
		addWeeks,
		subWeeks,
		getYear,
		endOfWeek,
		isDate,
		parse,
		intervalToDuration,
		addMonths
	} from "date-fns";
	import differenceInDays from "date-fns/differenceInDays";
	import differenceInWeeks from "date-fns/differenceInWeeks";
	import differenceInMonths from "date-fns/differenceInMonths";
	import differenceInYears from "date-fns/differenceInYears";
	import addYears from "date-fns/addYears";
	import { getFirstDay, translate } from "@nextcloud/l10n";

	const localeOptions = { weekStartsOn: getFirstDay() };
	const dateFormat = "yyyy-MM-dd";

	export let start = format(startOfWeek(new Date(), localeOptions), dateFormat, new Date());
	export let end = format(endOfWeek(new Date(), localeOptions), dateFormat, new Date());

	$: loading = false;
	$: scale = "day";
	$: points = [];
	$: weekTotal = 0;
	$: todayTotal = 0;
	$: highest = 0;
	$: startCursor = isDate(parse(start, dateFormat, new Date()))
		? parse(start, dateFormat, new Date())
		: startOfWeek(new Date(), localeOptions);
	$: endCursor = isDate(parse(end, dateFormat, new Date()))
		? parse(end, dateFormat, new Date())
		: endOfWeek(new Date(), localeOptions);
	$: currentWeek = null;
	const updateWeek = () => {
		weekTotal = 0;
		todayTotal = 0;
		highest = 0;
		currentWeek = getWeek(startCursor, localeOptions);
	};

	onMount(async () => {
		updateWeek();
		loadData();
	});

	const loadData = async () => {
		loading = true;
		// Reset points
		points = [];
		// Determine duration between cursors
		const durationDays = differenceInDays(endCursor, startCursor);
		const durationMonths = differenceInMonths(endCursor, startCursor);
		const durationWeeks = differenceInWeeks(endCursor, startCursor);
		const durationYears = differenceInYears(endCursor, startCursor);
		// Determine scale
		if (durationDays > 31 && durationDays <= 180) {
			scale = "week";
			Array.from(Array(durationWeeks + 1).keys()).forEach(week => {
				points.push({
					date: addWeeks(startCursor, week)
				});
			});
		} else if (durationDays > 180 && durationMonths <= 24) {
			scale = "month";
			Array.from(Array(durationMonths + 1).keys()).forEach(month => {
				points.push({
					date: addMonths(startCursor, month)
				});
			});
		} else if (durationMonths > 24) {
			scale = "year";
			Array.from(Array(durationYears + 1).keys()).forEach(year => {
				points.push({
					date: addYears(startCursor, year)
				});
			});
		} else {
			scale = "day";
			Array.from(Array(durationDays + 1).keys()).forEach(day => {
				points.push({
					date: addDays(startCursor, day)
				});
			});
		}

		// Load data from API
		const { grouped, js_date_format } = await loadStats();

		// Extract points from grouped array
		points = points.map(point => {
			// Get total from API response
			const total = grouped[format(point.date, js_date_format)];
			point.stats = {
				total: total ? Math.round(total * 100) / 100 : 0
			};
			// Find highest value
			if (total > highest) {
				highest = total;
			}
			// Sum up total
			weekTotal += point.stats.total;
			// Day total
			if (isSameDay(point.date, startOfToday())) {
				todayTotal += point.stats.total;
			}

			return point;
		});

		// Set columns
		document.documentElement.style.setProperty("--tm-stats-columns", points.length);

		loading = false;
	};

	const loadStats = async () => {
		const start = format(startCursor, "yyyy-MM-dd HH:mm:ss");
		const end = format(endCursor, "yyyy-MM-dd HH:mm:ss");
		const stats = await fetch(`${statsApiUrl}?start=${start}&end=${end}&group_by=${scale}`, {
			method: "GET",
			headers: {
				requesttoken: requestToken,
				"content-type": "application/json"
			}
		});
		return await stats.json();
	};

	const weekNavigation = mode => {
		if (mode === "reset") {
			startCursor = startOfWeek(startOfToday(), localeOptions);
			endCursor = endOfWeek(startCursor, localeOptions);
		} else if (mode === "next") {
			startCursor = addWeeks(startCursor, 1);
			endCursor = addWeeks(endCursor, 1);
		} else {
			startCursor = subWeeks(startCursor, 1);
			endCursor = subWeeks(endCursor, 1);
		}
		updateWeek();
		loadData();
	};

	const formatDateForScale = (date, type) => {
		if (type === "primary") {
			if (scale === "year") {
				return format(date, "yyyy");
			}
			if (scale === "month") {
				return format(date, "LLL");
			}
			if (scale === "week") {
				return `${translate("timemanager", "Week")} ${format(date, "w")}`;
			}
			return format(date, "iii");
		}
		if (type === "secondary") {
			if (scale === "year") {
				return "";
			}
			if (scale === "month") {
				return format(date, "yyyy");
			}
			if (scale === "week") {
				return `${format(startOfWeek(date, localeOptions), "d.M.")} - ${format(
					endOfWeek(date, localeOptions),
					"d.M."
				)}`;
			}
			return format(date, "d.M.");
		}
	};
</script>

{#if controls}
	<h2>{translate('timemanager', 'Statistics')}</h2>
{/if}
<div class={`${loading ? 'icon-loading' : ''}`}>
	{#if controls}
		<div class="top-stats">
			<figure>
				<figcaption class="tm_label">{translate('timemanager', 'Today')}</figcaption>
				{todayTotal} {translate('timemanager', 'hrs.')}
			</figure>
			<figure>
				<figcaption class="tm_label">{translate('timemanager', 'Week')}</figcaption>
				{weekTotal} {translate('timemanager', 'hrs.')}
			</figure>
		</div>
	{/if}
	<div class="graphs">
		<div class={`hours-per-week ${points.length > 12 || window.clientWidth < 768 ? 'many' : 'few'}`}>
			{#if !loading && weekTotal > 0}
				{#each points as point, index}
					<div class="column">
						{#if point && point.stats}
							{#if point.stats.total > 0}
								<span class="hours-label">{point.stats.total} {translate('timemanager', 'hrs.')}</span>
								<div class="column-inner" style={`height: ${(point.stats.total / highest) * 100}%`} />
							{/if}
							<div class="date-label">
								<span class="day">{formatDateForScale(point.date, 'primary')}</span>
								<span class="date">{formatDateForScale(point.date, 'secondary')}</span>
							</div>
						{/if}
					</div>
				{/each}
			{/if}
			{#if controls && !loading && weekTotal === 0}
				<p class="empty">{translate('timemanager', 'When you add entries for this week graphs will appear here.')}</p>
			{/if}
		</div>
		{#if controls}
			<nav class="week-navigation">
				<button class="previous" on:click|preventDefault={() => weekNavigation('previous')}>
					{translate('timemanager', 'Previous week')}
				</button>
				<span>
					{translate('timemanager', 'Week')} {currentWeek}
					<span class="dates">
						({format(startOfWeek(startCursor, localeOptions), 'iiiiii d.MM.Y')} &ndash; {format(endOfWeek(startCursor, localeOptions), 'iiiiii d.MM.Y')})
					</span>
				</span>
				<span>
					{#if !isSameDay(startOfWeek(startOfToday(), localeOptions), startCursor)}
						<button class="current" on:click|preventDefault={() => weekNavigation('reset')}>
							{translate('timemanager', 'Current week')}
						</button>
					{/if}
					<button class="next" on:click|preventDefault={() => weekNavigation('next')}>
						{translate('timemanager', 'Next week')}
					</button>
				</span>
			</nav>
		{/if}
	</div>
</div>
