<script>
	export let statsApiUrl;
	export let requestToken;

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
	} from "date-fns";

	const localeOptions = { weekStartsOn: 1 };
	let loading = false;
	let days = [];
	let weekTotal = 0;
	let todayTotal = 0;
	let highest = 0;
	let dayCursor = startOfToday();
	let currentWeek;
	const updateWeek = () => {
		weekTotal = 0;
		todayTotal = 0;
		currentWeek = getWeek(dayCursor, localeOptions);
	};

	onMount(async () => {
		updateWeek();
		loadData();
	});

	const loadData = async () => {
		loading = true;
		const monday = startOfWeek(dayCursor, localeOptions);
		days = [
			{ date: monday },
			{ date: addDays(monday, 1) },
			{ date: addDays(monday, 2) },
			{ date: addDays(monday, 3) },
			{ date: addDays(monday, 4) },
			{ date: addDays(monday, 5) },
			{ date: addDays(monday, 6) },
		];

		for (const day of days) {
			day.stats = await loadStatsForDay(day);
		}

		days.forEach((day) => {
			if (day.stats && day.stats.total) {
				// Find highest value
				if (day.stats.total > highest) {
					highest = day.stats.total;
				}
				// Sum up total
				weekTotal += day.stats.total;
				// Day total
				if (isSameDay(day.date, startOfToday())) {
					todayTotal += day.stats.total;
				}
			}
		});
		loading = false;
	};

	const loadStatsForDay = async (day) => {
		const start = format(startOfDay(day.date), "yyyy-MM-dd HH:mm:ss");
		const end = format(endOfDay(day.date), "yyyy-MM-dd HH:mm:ss");
		const stats = await fetch(`${statsApiUrl}?start=${start}&end=${end}`, {
			method: "GET",
			headers: {
				requesttoken: requestToken,
				"content-type": "application/json",
			},
		});
		return await stats.json();
	};

	const weekNavigation = (mode) => {
		if (mode === "reset") {
			dayCursor = startOfToday();
		} else if (mode === "next") {
			dayCursor = addWeeks(dayCursor, 1);
		} else {
			dayCursor = subWeeks(dayCursor, 1);
		}
		updateWeek();
		loadData();
	};
</script>

<h2>{window.t('timemanager', 'Statistics')}</h2>
<div class={`${loading ? 'icon-loading' : ''}`}>
	<div class="top-stats">
		<figure>
			<figcaption class="tm_label">{window.t('timemanager', 'Today')}</figcaption>
			{todayTotal} {window.t('timemanager', 'hrs.')}
		</figure>
		<figure>
			<figcaption class="tm_label">{window.t('timemanager', 'Week')}</figcaption>
			{weekTotal} {window.t('timemanager', 'hrs.')}
		</figure>
	</div>
	<div class="graphs">
		<div class="hours-per-week">
			{#each days as day}
				<div class="column">
					{#if day && day.stats}
						{#if day.stats.total > 0}
							<span class="hours-label">{day.stats.total} {window.t('timemanager', 'hrs.')}</span>
							<div class="column-inner" style={`height: ${(day.stats.total / highest) * 100}%`} />
						{/if}
						<div class="date-label">{format(day.date, 'iiiiii d.M.')}</div>
					{/if}
				</div>
			{/each}
			{#if !loading && weekTotal === 0}
				<p class="empty">{window.t('timemanager', 'When you add entries for this week graphs will appear here.')}</p>
			{/if}
		</div>
		<nav class="week-navigation">
			<button class="previous" on:click|preventDefault={() => weekNavigation('previous')}>
				{window.t('timemanager', 'Previous week')}
			</button>
			<span>
				{window.t('timemanager', 'Week')} {currentWeek}
				<span class="dates">
					({format(startOfWeek(dayCursor, localeOptions), 'iiiiii d.MM.Y')} &ndash; {format(endOfWeek(dayCursor, localeOptions), 'iiiiii d.MM.Y')})
				</span>
			</span>
			<button class="next" on:click|preventDefault={() => weekNavigation('next')}>
				{window.t('timemanager', 'Next week')}
			</button>
			{#if !isSameDay(startOfToday(), dayCursor)}
				<button class="current" on:click|preventDefault={() => weekNavigation('reset')}>
					{window.t('timemanager', 'Current week')}
				</button>
			{/if}
		</nav>
	</div>
</div>
