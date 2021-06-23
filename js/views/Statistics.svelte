<script>
	export let statsApiUrl;
	export let requestToken;
	export let start;
	export let end;

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
		intervalToDuration
	} from "date-fns";
	import { getFirstDay, translate } from "@nextcloud/l10n";

	const localeOptions = { weekStartsOn: getFirstDay() };
	const dateFormat = "yyyy-MM-dd";
	$: loading = false;
	$: scale = "none";
	$: points = [];
	$: weekTotal = 0;
	$: todayTotal = 0;
	$: highest = 0;
	$: startCursor = isDate(start) ? parse(start, dateFormat, new Date()) : startOfWeek(new Date(), localeOptions);
	$: endCursor = isDate(end) ? parse(end, dateFormat, new Date()) : endOfWeek(new Date(), localeOptions);
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
		const duration = intervalToDuration({
			start: startCursor,
			end: endCursor
		});
		// Determine scale
		if (duration.days > 31 && duration.days <= 180) {
			scale = "week";
			// new Array(duration.weeks).forEach(week => {
			// 	points.push({
			// 		date: addWeeks(startCursor, week),
			// 	})
			// })
		} else if (duration.days > 180) {
			scale = "month";
		} else {
			scale = "day";
			Array.from(Array(duration.days + 1).keys()).forEach(day => {
				points.push({
					date: addDays(startCursor, day)
				});
			});
		}

		// Load data from API
		const { grouped, js_date_format } = await loadStats(scale);

		// Extract points from grouped array
		points = points.map(point => {
			// Get total from API response
			const total = grouped[format(point.date, js_date_format)];
			point.stats = {
				total: total || 0
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

		loading = false;
	};

	const loadStats = async scale => {
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
</script>

<h2>{translate('timemanager', 'Statistics')}</h2>
<div class={`${loading ? 'icon-loading' : ''}`}>
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
	<div class="graphs">
		<div class="hours-per-week">
			{#if !loading && weekTotal > 0}
				{#each points as point}
					<div class="column">
						{#if point && point.stats}
							{#if point.stats.total > 0}
								<span class="hours-label">{point.stats.total} {translate('timemanager', 'hrs.')}</span>
								<div class="column-inner" style={`height: ${(point.stats.total / highest) * 100}%`} />
							{/if}
							<div class="date-label">{format(point.date, 'iiiiii d.M.')}</div>
						{/if}
					</div>
				{/each}
			{/if}
			{#if !loading && weekTotal === 0}
				<p class="empty">{translate('timemanager', 'When you add entries for this week graphs will appear here.')}</p>
			{/if}
		</div>
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
	</div>
</div>
