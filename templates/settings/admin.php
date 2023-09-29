<form id="timemanager-reporter" class="section">
	<h2><?php p($l->t('Reporter')) ?></h2>
	<p class="settings-hint">
      <?php p($l->t('Assign a role which is allowed to view all Entries.')) ?>
	</p>
	<select id="tm-reporter" style="min-width: 200px;">
		<option <?php p($_['reporter_group'] ? : 'selected') ?> disabled><?php p($l->t("Select...")) ?></option>
      <?php foreach ($_['groups'] as $group) { ?>
				<option <?php p($_['reporter_group'] === $group ? 'selected' : '') ?>><?php p($group) ?></option>
      <?php } ?>
	</select>
	<span id="tm-reporter-loading" style="left: 20px;"></span>
</form>

<form id="timemanager-sync-mode" class="section">
	<h2><?php p($l->t('Sync Mode')) ?></h2>
	<p class="settings-hint">
      <?php p($l->t('How confilicts are handled.')) ?>
	</p>
	<span class="checkbox-action">
		<input
			type="checkbox"
			class="checkbox"
			id="tm-handle-conflicts"
			<?php p($_['sync_mode'] === 'handle_conflicts' ? 'checked="checked"' : '') ?>
		/>
		<label for="tm-handle-conflicts">
			<?php p($l->t("My (mobile) apps can handle conflicts (leave unchecked if you're unsure)")) ?>
		</label>
	</span>
	<span id="tm-handle-conflicts-loading" class="checkbox-action-loading" style="left: 20px;"></span>
</form>
