<?php


declare(strict_types=1);

namespace OCA\TimeManager\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
use OCP\IDBConnection;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;

/**
 * Auto-generated migration step: Please modify to your needs!
 */
class Version3009Date20231202210000 extends SimpleMigrationStep
{
	/** @var IDBConnection */
	private $db;

	public function __construct(IDBConnection $db)
	{
		$this->db = $db;
	}

	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array   $options
	 */
	public function preSchemaChange(IOutput $output, Closure $schemaClosure, array $options): void
	{
	}

	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array   $options
	 * @return null|ISchemaWrapper
	 */
	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options): ?ISchemaWrapper
	{
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();

		$table = $schema->getTable("timemanager_share");

		$table->addColumn("recipient_id", "string", [
			"notnull" => true,
			"length"  => 64,
		]);
		$table->addColumn("recipient_type", "string", [
			"notnull" => true,
			"length"  => 64,
		]);

		$table->dropIndex("timemanager_share_with_index");
		$table->addIndex(["recipient_id", "recipient_type"], "timemanager_share_with_index");
		$table->dropIndex("timemanager_share_unique_index");
		$table->addUniqueIndex(
			["object_uuid", "entity_type", "author_user_id", "recipient_id", "recipient_type"],
			"timemanager_share_unique_index"
		);

		return $schema;
	}

	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array   $options
	 */
	public function postSchemaChange(IOutput $output, Closure $schemaClosure, array $options): void
	{
		$query = $this->db->getQueryBuilder();
		$query->update("timemanager_share")
			->set("recipient_id", "recipient_user_id")
			->set("recipient_type", $query->expr()->literal("user"));
		$query->executeStatement();
	}
}
