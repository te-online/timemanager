<?php

namespace OCA\TimeManager\Helper;

class ArrayToCSV {
	/**
	 * Adapted from https://stackoverflow.com/a/13474770
	 */
	static function convert(array &$array): string {
		if (count($array) == 0) {
			return '';
		}
		ob_start();
		$df = fopen("php://output", "w");
		fputcsv($df, array_keys(reset($array)));
		foreach ($array as $row) {
			fputcsv($df, $row);
		}
		fclose($df);
		return ob_get_clean();
	}
}
