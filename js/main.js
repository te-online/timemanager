import Statistics from "./views/Statistics.svelte";
import ClientEditorDialog from "./views/ClientEditorDialog.svelte";
import ProjectEditorDialog from "./views/ProjectEditorDialog.svelte";
import TaskEditorDialog from "./views/TaskEditorDialog.svelte";
import TimeEditorDialog from "./views/TimeEditorDialog.svelte";
import DeleteButton from "./views/DeleteButton.svelte";
import DeleteTimeEntryButton from "./views/DeleteTimeEntryButton.svelte";
import QuickAdd from "./views/QuickAdd.svelte";
import Checkmark from "./views/Checkmark.svelte";
import { Helpers } from "./lib/helpers";
import { PagePjax } from "./lib/pjax";
const components = [];

$(document).ready(function () {
	if ($('input[name="duration"]').length > 0) {
		$('input[name="duration"]')[0].focus();
	}
});

const init = () => {
	let store = {};
	const storeElement = document.querySelector("#content.app-timemanager [data-store]");
	if (storeElement) {
		try {
			store = JSON.parse(storeElement.getAttribute("data-store"));
		} catch (error) {
			console.error(error);
		}
	}

	components.push(
		new Statistics({
			target: Helpers.replaceNode(document.querySelector("#content.app-timemanager [data-svelte='statistics']")),
			props: {},
		})
	);

	components.push(
		new ClientEditorDialog({
			target: Helpers.replaceNode(
				document.querySelector("#content.app-timemanager [data-svelte='ClientEditorDialog.svelte']")
			),
			props: {
				...store,
				action: "",
				requestToken: window.OC.requestToken,
			},
		})
	);

	components.push(
		new ProjectEditorDialog({
			target: Helpers.replaceNode(
				document.querySelector("#content.app-timemanager [data-svelte='ProjectEditorDialog.svelte']")
			),
			props: {
				...store,
				requestToken: window.OC.requestToken,
			},
		})
	);

	components.push(
		new TaskEditorDialog({
			target: Helpers.replaceNode(
				document.querySelector("#content.app-timemanager [data-svelte='TaskEditorDialog.svelte']")
			),
			props: {
				...store,
				requestToken: window.OC.requestToken,
			},
		})
	);

	components.push(
		new TimeEditorDialog({
			target: Helpers.replaceNode(
				document.querySelector("#content.app-timemanager [data-svelte='TimeEditorDialog.svelte']")
			),
			props: {
				...store,
				requestToken: window.OC.requestToken,
			},
		})
	);

	components.push(
		new DeleteButton({
			target: Helpers.replaceNode(
				document.querySelector("#content.app-timemanager [data-svelte='DeleteButton.svelte']")
			),
			props: {
				...store,
				requestToken: window.OC.requestToken,
			},
		})
	);

	const deleteTimeEntryButtons = document.querySelectorAll(
		"#content.app-timemanager [data-svelte='DeleteTimeEntryButton.svelte']"
	);
	if (deleteTimeEntryButtons && deleteTimeEntryButtons.length > 0) {
		deleteTimeEntryButtons.forEach((button) => {
			components.push(
				new DeleteTimeEntryButton({
					target: Helpers.replaceNode(button),
					props: {
						...store,
						deleteTimeEntryUuid: button.getAttribute("data-uuid"),
						requestToken: window.OC.requestToken,
					},
				})
			);
		});
	}

	const editTimeEntryButtons = document.querySelectorAll(
		"#content.app-timemanager [data-svelte='EditTimeEntryButton.svelte']"
	);
	if (editTimeEntryButtons && editTimeEntryButtons.length > 0) {
		editTimeEntryButtons.forEach((button) => {
			components.push(
				new TimeEditorDialog({
					target: Helpers.replaceNode(button),
					props: {
						...store,
						timeUuid: button.getAttribute("data-uuid"),
						editTimeEntryData: JSON.parse(button.getAttribute("data-edit-data")),
						timeEditorButtonCaption: "Edit",
						timeEditorCaption: "Edit time entry",
						requestToken: window.OC.requestToken,
					},
				})
			);
		});
	}

	components.push(
		new QuickAdd({
			target: Helpers.replaceNode(document.querySelector("#content.app-timemanager [data-svelte='QuickAdd.svelte']")),
			props: {
				...store,
				requestToken: window.OC.requestToken,
			},
		})
	);

	const checkmarkButtons = document.querySelectorAll("#content.app-timemanager [data-svelte='Checkmark.svelte']");
	if (checkmarkButtons && checkmarkButtons.length > 0) {
		checkmarkButtons.forEach((button) => {
			components.push(
				new Checkmark({
					target: Helpers.replaceNode(button),
					props: {
						...store,
						uuid: button.getAttribute("data-uuid"),
						action: button.getAttribute("data-action"),
						initialState: button.getAttribute("data-initialState"),
						requestToken: window.OC.requestToken,
					},
				})
			);
		});
	}
};

init();
components.push(new PagePjax(init));
