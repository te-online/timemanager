<script>
	import { translate } from "@nextcloud/l10n";
	import { InputMethods } from "../lib/constants";
	export let isServer;

	$: inputMethod = localStorage.getItem("timemanager_input_method") ?? InputMethods.decimal;
	const changeInputMethod = (newInputMethod) => {
		localStorage.setItem("timemanager_input_method", newInputMethod);
	}
</script>

{#if !isServer}
	<details open>
		<summary>
			{translate("timemanager", "Time field settings")}
		</summary>

		<p style="margin: 8px auto">{translate("timemanager", "This setting is saved in your browser only. Clearing cache or changing browsers will reset it.")}</p>

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