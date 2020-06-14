<script>
	export let statsApiUrl;
	export let requestToken;

	import { onMount } from "svelte";
	import { startOfWeek, addDays, startOfDay, endOfDay, format, isSameDay, startOfToday } from "date-fns";

	let loading = false;
	let days = [];
	let weekTotal = 0;
	let todayTotal = 0;
	let highest = 0;

	onMount(async () => {
		loading = true;
		const monday = startOfWeek(startOfToday(), { weekStartsOn: 1 });
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
	});

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
</script>

<div class={`${loading ? 'icon-loading' : ''}`}>
	<div class="top-stats">
		<figure>
			<figcaption class="tm_label">Today</figcaption>
			{todayTotal} hrs.
		</figure>
		<figure>
			<figcaption class="tm_label">Week</figcaption>
			{weekTotal} hrs.
		</figure>
	</div>
	<div class="graphs">
		<div class="hours-per-week">
			{#each days as day}
				<div class="column">
					{#if day && day.stats}
						{#if day.stats.total > 0}
							<span>{day.stats.total} hrs.</span>
						{/if}
						<div class="column-inner" style={`height: ${(day.stats.total / highest) * 100}%`} />
						<span class="date-label">{format(day.date, 'iiiiii d.M.')}</span>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>
