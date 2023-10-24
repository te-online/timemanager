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
class Version2003Date20210714185329 extends SimpleMigrationStep {
	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array $options
	 */
	public function preSchemaChange(IOutput $output, Closure $schemaClosure, array $options) {
	}

	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array $options
	 * @return null|ISchemaWrapper
	 */
	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options) {
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();

		if (!$schema->hasTable("timemanager_client")) {
			$table = $schema->createTable("timemanager_client");
			$table->addColumn("id", "bigint", [
				"autoincrement" => true,
				"notnull" => true,
				"length" => 8,
				"unsigned" => true,
			]);
			$table->addColumn("user_id", "string", [
				"notnull" => true,
				"length" => 64,
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
			$table->addColumn("city", "text", [
				"notnull" => false,
			]);
			$table->addColumn("commit", "string", [
				"notnull" => false,
				"length" => 64,
			]);
			$table->addColumn("email", "text", [
				"notnull" => false,
			]);
			$table->addColumn("name", "text", [
				"notnull" => false,
			]);
			$table->addColumn("note", "text", [
				"notnull" => false,
			]);
			$table->addColumn("phone", "text", [
				"notnull" => false,
			]);
			$table->addColumn("postcode", "text", [
				"notnull" => false,
			]);
			$table->addColumn("street", "text", [
				"notnull" => false,
			]);
			$table->addColumn("web", "text", [
				"notnull" => false,
			]);
			$table->addColumn("billable_default", "boolean", [
				"notnull" => false,
			]);
			$table->addColumn("status", "text", [
				"notnull" => false,
			]);
			$table->setPrimaryKey(["id"]);
			$table->addIndex(["uuid"], "timemanager_client_uuid_index");
		}

		if (!$schema->hasTable("timemanager_project")) {
			$table = $schema->createTable("timemanager_project");
			$table->addColumn("id", "bigint", [
				"autoincrement" => true,
				"notnull" => true,
				"length" => 8,
				"unsigned" => true,
			]);
			$table->addColumn("user_id", "string", [
				"notnull" => true,
				"length" => 64,
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
			$table->addColumn("client_uuid", "string", [
				"notnull" => false,
				"length" => 64,
			]);
			$table->addColumn("commit", "string", [
				"notnull" => false,
				"length" => 64,
			]);
			$table->addColumn("color", "text", [
				"notnull" => false,
			]);
			$table->addColumn("name", "text", [
				"notnull" => false,
			]);
			$table->addColumn("note", "text", [
				"notnull" => false,
			]);
			$table->addColumn("billable", "boolean", [
				"notnull" => false,
			]);
			$table->addColumn("status", "text", [
				"notnull" => false,
			]);
			$table->setPrimaryKey(["id"]);
			$table->addIndex(["uuid"], "timemanager_project_uuid_index");
		}

		if (!$schema->hasTable("timemanager_task")) {
			$table = $schema->createTable("timemanager_task");
			$table->addColumn("id", "bigint", [
				"autoincrement" => true,
				"notnull" => true,
				"length" => 8,
				"unsigned" => true,
			]);
			$table->addColumn("user_id", "string", [
				"notnull" => true,
				"length" => 64,
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
			$table->addColumn("project_uuid", "string", [
				"notnull" => false,
				"length" => 64,
			]);
			$table->addColumn("commit", "string", [
				"notnull" => false,
				"length" => 64,
			]);
			$table->addColumn("name", "text", [
				"notnull" => false,
			]);
			$table->addColumn("billable", "boolean", [
				"notnull" => false,
			]);
			$table->addColumn("status", "text", [
				"notnull" => false,
			]);
			$table->setPrimaryKey(["id"]);
			$table->addIndex(["uuid"], "timemanager_task_uuid_index");
		}

		if (!$schema->hasTable("timemanager_time")) {
			$table = $schema->createTable("timemanager_time");
			$table->addColumn("id", "bigint", [
				"autoincrement" => true,
				"notnull" => true,
				"length" => 8,
				"unsigned" => true,
			]);
			$table->addColumn("user_id", "string", [
				"notnull" => true,
				"length" => 64,
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
			$table->addColumn("start", "datetime", [
				"notnull" => true,
			]);
			$table->addColumn("end", "datetime", [
				"notnull" => true,
			]);
			$table->addColumn("task_uuid", "string", [
				"notnull" => false,
				"length" => 64,
			]);
			$table->addColumn("commit", "string", [
				"notnull" => false,
				"length" => 64,
			]);
			$table->addColumn("note", "text", [
				"notnull" => false,
			]);
			$table->addColumn("payment_status", "text", [
				"notnull" => false,
			]);
			$table->addColumn("status", "text", [
				"notnull" => false,
			]);
			$table->setPrimaryKey(["id"]);
			$table->addIndex(["uuid"], "timemanager_time_uuid_index");
		}

		if (!$schema->hasTable("timemanager_commit")) {
			$table = $schema->createTable("timemanager_commit");
			$table->addColumn("id", "bigint", [
				"autoincrement" => true,
				"notnull" => true,
				"length" => 8,
				"unsigned" => true,
			]);
			$table->addColumn("user_id", "string", [
				"notnull" => true,
				"length" => 64,
			]);
			$table->addColumn("commit", "string", [
				"notnull" => false,
				"length" => 64,
			]);
			$table->addColumn("created", "datetime", [
				"notnull" => true,
			]);
			$table->setPrimaryKey(["id"]);
			$table->addIndex(["id"], "timemanager_commit_id_index");
		}
		return $schema;
	}

	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array $options
	 */
	public function postSchemaChange(IOutput $output, Closure $schemaClosure, array $options) {
	}
}
