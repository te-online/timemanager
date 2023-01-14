import Statistics from "./views/Statistics.svelte";
import ClientEditorDialog from "./views/ClientEditorDialog.svelte";
import ProjectEditorDialog from "./views/ProjectEditorDialog.svelte";
import TaskEditorDialog from "./views/TaskEditorDialog.svelte";
import TimeEditorDialog from "./views/TimeEditorDialog.svelte";
import DeleteButton from "./views/DeleteButton.svelte";
import ShareDialog from "./views/ShareDialog.svelte";
import ShareStatus from "./views/ShareStatus.svelte";
import DeleteTimeEntryButton from "./views/DeleteTimeEntryButton.svelte";
import QuickAdd from "./views/QuickAdd.svelte";
import Checkmark from "./views/Checkmark.svelte";
import Filters from "./views/Filters.svelte";
import Timerange from "./views/Timerange.svelte";
import PrintButton from "./views/PrintButton.svelte";
import Import from "./views/Import.svelte";
import UserFilterButton from "./views/UserFilterButton.svelte";
// import Settings from "./views/Settings.svelte";
import { Helpers } from "./lib/helpers";
import { PagePjax } from "./lib/pjax";
import { translate } from "@nextcloud/l10n";
import { format, parseISO } from "date-fns";
import auth from "@nextcloud/auth";
import "../css/timemanager.scss";
const token = auth.getRequestToken();
const components = [];
const pjax = [];

const defaultDateFormat = "EEEE, MMMM d, y";
const localeOptions = Helpers.getDateLocaleOptions();

$(document).ready(function () {
	if ($('input[name="duration"]').length > 0) {
		$('input[name="duration"]')[0].focus();
	}
});

const safelyCreateComponent = ({ component: Component, selector, props = {} }) => {
	const node = document.querySelector(selector);
	if (node) {
		return new Component({ target: Helpers.replaceNode(node), props });
	}
};

const init = () => {
	// Destroy all previous components
	while (components.length) {
		const component = components.pop();
		if (!component) {
			continue;
		}

		try {
			component.$destroy();
		} catch (error) {
			console.error(error);
		}
	}

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
		safelyCreateComponent({
			component: Statistics,
			selector: "#content.app-timemanager [data-svelte='Statistics.svelte']",
			props: { ...store },
		})
	);

	components.push(
		safelyCreateComponent({
			component: Filters,
			selector: "#content.app-timemanager [data-svelte='Filters.svelte']",
			props: { ...store },
		})
	);

	components.push(
		safelyCreateComponent({
			component: Timerange,
			selector: "#content.app-timemanager [data-svelte='Timerange.svelte']",
			props: { ...store },
		})
	);

	components.push(
		safelyCreateComponent({
			component: ClientEditorDialog,
			selector: "#content.app-timemanager [data-svelte='ClientEditorDialog.svelte']",
			props: {
				...store,
				action: "",
				requestToken: token,
			},
		})
	);

	components.push(
		safelyCreateComponent({
			component: ProjectEditorDialog,
			selector: "#content.app-timemanager [data-svelte='ProjectEditorDialog.svelte']",
			props: {
				...store,
				requestToken: token,
			},
		})
	);

	components.push(
		safelyCreateComponent({
			component: TaskEditorDialog,
			selector: "#content.app-timemanager [data-svelte='TaskEditorDialog.svelte']",
			props: {
				...store,
				requestToken: token,
			},
		})
	);

	components.push(
		safelyCreateComponent({
			component: TimeEditorDialog,
			selector: "#content.app-timemanager [data-svelte='TimeEditorDialog.svelte']",
			props: {
				...store,
				requestToken: token,
			},
		})
	);

	components.push(
		safelyCreateComponent({
			component: DeleteButton,
			selector: "#content.app-timemanager [data-svelte='DeleteButton.svelte']",
			props: {
				...store,
				requestToken: token,
			},
		})
	);

	components.push(
		safelyCreateComponent({
			component: ShareDialog,
			selector: "#content.app-timemanager [data-svelte='ShareDialog.svelte']",
			props: {
				...store,
				requestToken: token,
			},
		})
	);

	components.push(
		safelyCreateComponent({
			component: ShareStatus,
			selector: "#content.app-timemanager [data-svelte='ShareStatus.svelte']",
			props: {
				...store,
				requestToken: token,
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
						requestToken: token,
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
						timeEditorButtonCaption: translate("timemanager", "Edit"),
						timeEditorCaption: translate("timemanager", "Edit time entry"),
						requestToken: token,
					},
				})
			);
		});
	}

	components.push(
		safelyCreateComponent({
			component: QuickAdd,
			selector: "#content.app-timemanager [data-svelte='QuickAdd.svelte']",
			props: {
				...store,
				requestToken: token,
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
						requestToken: token,
					},
				})
			);
		});
	}

	components.push(
		safelyCreateComponent({
			component: PrintButton,
			selector: "#content.app-timemanager [data-svelte='PrintButton.svelte']",
		})
	);

	components.push(
		safelyCreateComponent({
			component: Import,
			selector: "#content.app-timemanager [data-svelte='Import.svelte']",
			props: {
				...store,
				requestToken: token,
			},
		})
	);

	components.push(
		safelyCreateComponent({
			component: UserFilterButton,
			selector: "#content.app-timemanager [data-svelte='UserFilterButton.svelte']",
			props: {
				...store,
				requestToken: token,
			},
		})
	);

	// components.push(
	// 	new Settings({
	// 		target: Helpers.replaceNode(document.querySelector("#content.app-timemanager [data-svelte='Settings.svelte']")),
	// 		props: {
	// 			...store,
	// 			requestToken: token,
	// 		},
	// 	})
	// );

	const dateTimeElements = document.querySelectorAll("[data-datetime]");
	if (dateTimeElements && dateTimeElements.length > 0) {
		dateTimeElements.forEach((element) => {
			const datetime = element.getAttribute("data-datetime");
			if (!datetime) {
				return;
			}
			element.innerHTML = format(
				parseISO(datetime),
				store?.settings?.fullDateFormat ?? defaultDateFormat,
				localeOptions
			);
		});
	}

	document.body.classList.add("tm_ready");
};

init();
pjax.push(new PagePjax(init));
