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
class Version3009Date20230918152300 extends SimpleMigrationStep {
	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array   $options
	 */
	public function preSchemaChange(IOutput $output, Closure $schemaClosure, array $options): void {
	}

	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array   $options
	 * @return null|ISchemaWrapper
	 */
	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options): ?ISchemaWrapper {
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();

		$table = $schema->getTable("timemanager_share");

		$table->changeColumn("recipient_id", [
			"notnull" => true
		]);
		$table->changeColumn("recipient_type", [
			"notnull" => true
		]);

		$table->dropIndex("timemanager_share_with_index");
		$table->addIndex(["recipient_id", "recipient_type"], "timemanager_share_with_index");
		$table->dropIndex("timemanager_share_unique_index");
		$table->addUniqueIndex(
			["object_uuid", "entity_type", "author_user_id", "recipient_id", "recipient_type"],
			"timemanager_share_unique_index"
		);

		$table->dropColumn("recipient_user_id");

		return $schema;
	}

	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array   $options
	 */
	public function postSchemaChange(IOutput $output, Closure $schemaClosure, array $options): void {
	}
}
