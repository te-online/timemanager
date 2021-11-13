<?php

declare(strict_types=1);

namespace OCA\Timemanager\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;
use OCP\IDBConnection;
use OCA\TimeManager\Helper\UUID;

/**
 * Auto-generated migration step: Please modify to your needs!
 */
class Version2006Date20211113102317 extends SimpleMigrationStep {
	private $db;

	public function __construct(IDBConnection $db) {
		$this->db = $db;
	}

	// Make all uuids unique here
	private function unique_uuids(string $table_name, string $column_name): void {
		$query_duplicates = $this->db->getQueryBuilder();
		$query_duplicates->select($column_name);
		$query_duplicates->from($table_name);
		$query_duplicates->groupBy($column_name);
		$query_duplicates->having("COUNT(`$column_name`) > 1");
		$cursor = $query_duplicates->execute();
		$rows = $cursor->fetchAll();
		$cursor->closeCursor();
		$duplicate_uuids = array_map(static function (array $row) use ($column_name): string {
			return (string) $row[$column_name];
		}, $rows);

		foreach ($duplicate_uuids as $uuid) {
			$query_rows_to_update = $this->db->getQueryBuilder();
			$query_rows_to_update->select("id");
			$query_rows_to_update->from($table_name);
			$query_rows_to_update->where(
				$query_rows_to_update->expr()->eq($column_name, $query_rows_to_update->createNamedParameter($uuid))
			);
			$cursor = $query_rows_to_update->execute();
			$rows_to_update = $cursor->fetchAll();
			$cursor->closeCursor();

			foreach ($rows_to_update as $index => $update_row) {
				// Skip the first one, because it's legitimate to have one of each uuid
				if ($index === 0) {
					continue;
				}
				$query = $this->db->getQueryBuilder();
				$query->update($table_name);
				$query->set($column_name, $query->createNamedParameter(UUID::v4()));
				$query->where($query->expr()->eq("id", $query->createNamedParameter($update_row["id"])));
				$query->execute();
			}
		}
	}

	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array $options
	 */
	public function preSchemaChange(IOutput $output, Closure $schemaClosure, array $options): void {
		$this->unique_uuids("timemanager_client", "uuid");
		$this->unique_uuids("timemanager_project", "uuid");
		$this->unique_uuids("timemanager_task", "uuid");
		$this->unique_uuids("timemanager_time", "uuid");
		$this->unique_uuids("timemanager_commit", "commit");
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

		$table = $schema->getTable("timemanager_client");
		$table->dropIndex("timemanager_client_uuid_index");
		$table->addUniqueIndex(["uuid"], "timemanager_client_uuid_index");

		$table = $schema->getTable("timemanager_project");
		$table->dropIndex("timemanager_project_uuid_index");
		$table->addUniqueIndex(["uuid"], "timemanager_project_uuid_index");

		$table = $schema->getTable("timemanager_task");
		$table->dropIndex("timemanager_task_uuid_index");
		$table->addUniqueIndex(["uuid"], "timemanager_task_uuid_index");

		$table = $schema->getTable("timemanager_time");
		$table->dropIndex("timemanager_time_uuid_index");
		$table->addUniqueIndex(["uuid"], "timemanager_time_uuid_index");

		$table = $schema->getTable("timemanager_commit");
		$table->dropIndex("timemanager_commit_id_index");
		$table->addUniqueIndex(["commit"], "timemanager_commit_index");

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
