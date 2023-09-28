<?php

declare(strict_types=1);

namespace OCA\TimeManager\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;

/**
 * Auto-generated migration step: Please modify to your needs!
 */
class Version3000Date20220303184955 extends SimpleMigrationStep {
	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array $options
	 */
	public function preSchemaChange(IOutput $output, Closure $schemaClosure, array $options): void {
	}

	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array $options
	 * @return null|ISchemaWrapper
	 */
	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options): ?ISchemaWrapper {
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();

		if (!$schema->hasTable("timemanager_share")) {
			$table = $schema->createTable("timemanager_share");
			$table->addColumn("id", "bigint", [
				"autoincrement" => true,
				"notnull" => true,
				"length" => 8,
				"unsigned" => true,
			]);
			$table->addColumn("uuid", "string", [
				"notnull" => true,
				"length" => 64,
			]);
			$table->addColumn("changed", "datetime", [
				"notnull" => true,
			]);
			$table->addColumn("created", "datetime", [
				"notnull" => true,
			]);
			$table->addColumn("object_uuid", "string", [
				"notnull" => true,
				"length" => 64,
			]);
			$table->addColumn("entity_type", "string", [
				"notnull" => false,
				"length" => 64,
			]);
			$table->addColumn("author_user_id", "string", [
				"notnull" => true,
				"length" => 64,
			]);
			$table->addColumn("recipient_user_id", "string", [
				"notnull" => true,
				"length" => 64,
			]);
			$table->setPrimaryKey(["id"]);
			$table->addUniqueIndex(["uuid"], "timemanager_share_uuid_index");
			$table->addIndex(["object_uuid"], "timemanager_share_object_index");
			$table->addIndex(["entity_type"], "timemanager_share_entity_index");
			$table->addIndex(["author_user_id"], "timemanager_share_author_index");
			$table->addIndex(["recipient_user_id"], "timemanager_share_with_index");
			$table->addUniqueIndex(
				["object_uuid", "entity_type", "author_user_id", "recipient_user_id"],
				"timemanager_share_unique_index"
			);
		}

		return $schema;
	}

	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array $options
	 */
	public function postSchemaChange(IOutput $output, Closure $schemaClosure, array $options): void {
	}
}
