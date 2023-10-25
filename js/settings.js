async function tmSaveSettings(body) {
	try {
		const response = await fetch(OC.generateUrl("/apps/timemanager/api/settings"), {
			method: "POST",
			headers: {
				requesttoken: OC.requestToken,
				"content-type": "application/json"
			},
			body: JSON.stringify(body)
		});

		const result = await response.json();
	} catch (error) {
		console.error(`Cannot save setting: ${error.message}`);
	}
}

document.getElementById("tm-reporter").addEventListener("change", async (e) => {
	let value = e.target.value;
	const loading = document.getElementById("tm-reporter-loading");

	loading.classList.add("icon-loading");
	await tmSaveSettings({
		reporter: value
	});
	loading.classList.remove("icon-loading");
});

document.getElementById("tm-handle-conflicts").addEventListener("change", async (e) => {
	let value = e.target.checked;
	const loading = document.getElementById("tm-handle-conflicts-loading");

	loading.classList.add("icon-loading");
	await tmSaveSettings({
		handle_conflicts: value
	});
	loading.classList.remove("icon-loading");
});
