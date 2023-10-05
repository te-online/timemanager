<?php

namespace OCA\TimeManager\Db;

use OCP\AppFramework\Db\QBMapper;
use OCP\IDBConnection;

/**
 * Class CommitMapper
 *
 * @package OCA\TimeManager\Db
 * @method Commit insert(Commit $entity)
 */
class CommitMapper extends QBMapper implements ICurrentUser {
	protected string $userId;

	public function __construct(IDBConnection $db) {
		parent::__construct($db, "timemanager_commit");
	}

	function setCurrentUser(string $userId): void
    {
		$this->userId = $userId;
	}

	function getLatestCommit() {
		$sql = $this->db->getQueryBuilder();
		$sql
			->select("*")
			->from($this->tableName)
			->where("`user_id` = ?")
			->orderBy("created", "DESC")
			->setMaxResults(1);
		$sql->setParameters([$this->userId]);
		$commit = $this->findEntities($sql);

		if (count($commit) > 0) {
			return $commit[0]->getCommit();
		} else {
			// @TODO: Error
		}
	}

	function getCommitsAfter($commit) {
		// Find the given commit first, see if we have it.
		$sql = $this->db->getQueryBuilder();
		$sql
			->select("commit")
			->from($this->tableName)
			->where("`user_id` = ?")
			->andWhere("`commit` = ?")
			->setMaxResults(1);
		$sql->setParameters([$this->userId, $commit]);
		$givenCommit = $this->findEntities($sql);

		$sql = $this->db->getQueryBuilder();

		// The given commit is found, all fine.
		if (count($givenCommit) > 0) {
			$sql
				->select("*")
				->from($this->tableName)
				->where("`user_id` = ?")
				->andWhere("`created` > ?")
				->orderBy("created");
			$sql->setParameters([$this->userId, $givenCommit[0]->getCreated()]);

		} else {
			// The given commit is unknown. All commits are applicable.
			$sql
				->select("*")
				->from($this->tableName)
				->where("`user_id` = ?")
				->orderBy("created");
			$sql->setParameters([$this->userId]);
		}

		return array_map(function ($commit) {
			return $commit->toString();
		}, $this->findEntities($sql));
	}
}
