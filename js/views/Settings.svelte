<script>
	import { translate } from "@nextcloud/l10n";
	import { InputMethods } from "../lib/constants";

	export let isServer;
	export let settings = {
		timemanager_input_method: InputMethods.decimal,
	};
	export let settingsAction;
	export let requestToken;

	let inputMethod = settings.timemanager_input_method ?? InputMethods.decimal;

	const changeInputMethod = async (newInputMethod) => {
		const previousInputMethod = inputMethod;
		inputMethod = newInputMethod;

		const response = await fetch(
			settingsAction,
			{
				method: 'POST',
				headers: {
					requesttoken: requestToken,
					"content-type": "application/json",
				},
				body: JSON.stringify({
					timemanager_input_method: newInputMethod,
				}),
			}
		);

		if (!response.ok) {
			inputMethod = previousInputMethod;
			alert(translate("timemanager", "Could not save settings."));
		}
	}
</script>

{#if !isServer}
	<details open>
		<summary>
			{translate("timemanager", "Time field settings")}
		</summary>

		<label class="settings-label">
			<input
				type="radio"
				name="settings-input-method"
				bind:group={inputMethod}
				value={InputMethods.minutes}
				on:click={() => changeInputMethod(InputMethods.minutes)}
			/>
			{translate("timemanager", "Input hours and minutes (02:30 hrs.)")}
		</label>
		<label class="settings-label">
			<input
				type="radio"
				name="settings-input-method"
				bind:group={inputMethod}
				value={InputMethods.decimal}
				on:click={() => changeInputMethod(InputMethods.decimal)}
			/>
			{translate("timemanager", "Input decimals (2.5 hrs.)")}
		</label>
	</details>
{/if}