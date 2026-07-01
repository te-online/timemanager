<?php

namespace OCA\TimeManager\Helper;

/**
 * Generates a minimal but valid .xlsx file (Office Open XML) from an array of rows.
 * Uses only PHP built-ins — no extra Composer dependencies required.
 *
 * The format produced:
 *  - First row: bold header with light-blue background (#4A90D9)
 *  - Data rows: plain cells
 *  - Last row of the "duration" column (if present): SUM formula
 *  - Column widths are estimated from the longest value in each column
 */
class ArrayToXLSX {

	/**
	 * Convert an array of associative arrays to XLSX binary content.
	 *
	 * @param array  $rows       Array of associative arrays (all rows must share the same keys)
	 * @param string $sheetTitle Worksheet name (max 31 chars, special chars stripped)
	 * @return string            Raw XLSX binary content ready for DataDownloadResponse
	 */
	static function convert(array $rows, string $sheetTitle = 'Time Report'): string {
		// Sanitise sheet title (Excel limit: 31 chars, no /\?*[]:
		$sheetTitle = preg_replace('/[\/\\\\\?\*\[\]\:]/', '', $sheetTitle);
		$sheetTitle = substr($sheetTitle, 0, 31);
		if ($sheetTitle === '') {
			$sheetTitle = 'Sheet1';
		}

		if (empty($rows)) {
			$headers = [];
			$dataRows = [];
		} else {
			$headers = array_keys(reset($rows));
			$dataRows = array_values($rows);
		}

		$durationColIdx = array_search('duration', $headers); // 0-based, false if absent
		$numCols = count($headers);
		$numDataRows = count($dataRows);

		// --- Shared strings ---
		$strings = [];
		$stringIndex = [];
		$addString = function (string $s) use (&$strings, &$stringIndex): int {
			if (!isset($stringIndex[$s])) {
				$stringIndex[$s] = count($strings);
				$strings[] = $s;
			}
			return $stringIndex[$s];
		};

		// Collect header strings
		$headerIndices = [];
		foreach ($headers as $h) {
			$headerIndices[] = $addString(ucfirst((string)$h));
		}

		// Collect data strings / detect numeric columns
		$cellData = []; // [rowIdx][colIdx] => ['t' => 's'|'n'|'f', 'v' => ...]
		foreach ($dataRows as $ri => $row) {
			$rowValues = array_values($row);
			foreach ($rowValues as $ci => $val) {
				if (is_numeric($val)) {
					$cellData[$ri][$ci] = ['t' => 'n', 'v' => $val];
				} else {
					$idx = $addString((string)$val);
					$cellData[$ri][$ci] = ['t' => 's', 'v' => $idx];
				}
			}
		}

		// --- Column widths (estimate) ---
		$colWidths = array_fill(0, $numCols, 10);
		foreach ($headers as $ci => $h) {
			$colWidths[$ci] = max($colWidths[$ci], strlen((string)$h) + 4);
		}
		foreach ($dataRows as $row) {
			$rowValues = array_values($row);
			foreach ($rowValues as $ci => $val) {
				$colWidths[$ci] = max($colWidths[$ci], min(strlen((string)$val) + 2, 50));
			}
		}

		// --- Build worksheet XML ---
		$colLetters = [];
		for ($i = 0; $i < $numCols; $i++) {
			$colLetters[] = self::colLetter($i);
		}

		$wsXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n";
		$wsXml .= '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"'
			. ' xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' . "\n";

		// Column widths
		$wsXml .= '<cols>' . "\n";
		for ($ci = 0; $ci < $numCols; $ci++) {
			$n = $ci + 1;
			$wsXml .= "<col min=\"$n\" max=\"$n\" width=\"{$colWidths[$ci]}\" customWidth=\"1\"/>\n";
		}
		$wsXml .= '</cols>' . "\n";

		$wsXml .= '<sheetData>' . "\n";

		// Header row (row 1) — style index 1 (bold+blue bg)
		$wsXml .= '<row r="1">' . "\n";
		foreach ($headerIndices as $ci => $si) {
			$cell = $colLetters[$ci] . '1';
			$wsXml .= "<c r=\"$cell\" t=\"s\" s=\"1\"><v>$si</v></c>\n";
		}
		$wsXml .= '</row>' . "\n";

		// Data rows
		for ($ri = 0; $ri < $numDataRows; $ri++) {
			$rowNum = $ri + 2;
			$wsXml .= "<row r=\"$rowNum\">\n";
			for ($ci = 0; $ci < $numCols; $ci++) {
				$cell = $colLetters[$ci] . $rowNum;
				$cd = $cellData[$ri][$ci] ?? ['t' => 's', 'v' => $addString('')];
				if ($cd['t'] === 'n') {
					$wsXml .= "<c r=\"$cell\"><v>{$cd['v']}</v></c>\n";
				} else {
					$wsXml .= "<c r=\"$cell\" t=\"s\"><v>{$cd['v']}</v></c>\n";
				}
			}
			$wsXml .= '</row>' . "\n";
		}

		// SUM row for duration column
		if ($durationColIdx !== false && $numDataRows > 0) {
			$sumRowNum = $numDataRows + 2;
			$durationLetter = $colLetters[$durationColIdx];
			$rangeStart = $durationLetter . '2';
			$rangeEnd   = $durationLetter . ($numDataRows + 1);
			$wsXml .= "<row r=\"$sumRowNum\">\n";
			$sumCell = $durationLetter . $sumRowNum;
			$wsXml .= "<c r=\"$sumCell\" s=\"2\"><f>SUM($rangeStart:$rangeEnd)</f></c>\n";
			$wsXml .= '</row>' . "\n";
		}

		$wsXml .= '</sheetData>' . "\n";
		$wsXml .= '</worksheet>';

		// --- Shared strings XML ---
		$ssCount = count($strings);
		$ssXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n";
		$ssXml .= "<sst xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\" count=\"$ssCount\" uniqueCount=\"$ssCount\">\n";
		foreach ($strings as $s) {
			$escaped = htmlspecialchars((string)$s, ENT_XML1, 'UTF-8');
			$ssXml .= "<si><t xml:space=\"preserve\">$escaped</t></si>\n";
		}
		$ssXml .= '</sst>';

		// --- Styles XML ---
		// xfId 0: default
		// xfId 1: bold + blue background (header)
		// xfId 2: bold (SUM)
		$stylesXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n";
		$stylesXml .= '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">';
		$stylesXml .= '<fonts count="2">';
		$stylesXml .= '<font><sz val="11"/><name val="Calibri"/></font>'; // 0: normal
		$stylesXml .= '<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>'; // 1: bold white
		$stylesXml .= '</fonts>';
		$stylesXml .= '<fills count="3">';
		$stylesXml .= '<fill><patternFill patternType="none"/></fill>'; // 0
		$stylesXml .= '<fill><patternFill patternType="gray125"/></fill>'; // 1 (required)
		$stylesXml .= '<fill><patternFill patternType="solid"><fgColor rgb="FF4A90D9"/></patternFill></fill>'; // 2: blue header
		$stylesXml .= '</fills>';
		$stylesXml .= '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>';
		$stylesXml .= '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>';
		$stylesXml .= '<cellXfs count="3">';
		$stylesXml .= '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>';  // 0: default
		$stylesXml .= '<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>';  // 1: header
		$stylesXml .= '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>';  // 2: bold SUM
		$stylesXml .= '</cellXfs>';
		$stylesXml .= '</styleSheet>';

		// --- Assemble ZIP (XLSX is just a ZIP) ---
		if (!class_exists('ZipArchive')) {
			return ''; // ZipArchive not available
		}

		$tmpFile = tempnam(sys_get_temp_dir(), 'tm_xlsx_');
		$zip = new \ZipArchive();
		$zip->open($tmpFile, \ZipArchive::OVERWRITE);

		// [Content_Types].xml
		$zip->addFromString('[Content_Types].xml',
			'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n" .
			'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' .
			'<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' .
			'<Default Extension="xml" ContentType="application/xml"/>' .
			'<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' .
			'<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' .
			'<Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>' .
			'<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' .
			'</Types>'
		);

		// _rels/.rels
		$zip->addFromString('_rels/.rels',
			'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n" .
			'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' .
			'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' .
			'</Relationships>'
		);

		// xl/workbook.xml
		$escapedTitle = htmlspecialchars($sheetTitle, ENT_XML1, 'UTF-8');
		$zip->addFromString('xl/workbook.xml',
			'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n" .
			'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"' .
			' xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' .
			'<sheets><sheet name="' . $escapedTitle . '" sheetId="1" r:id="rId1"/></sheets>' .
			'</workbook>'
		);

		// xl/_rels/workbook.xml.rels
		$zip->addFromString('xl/_rels/workbook.xml.rels',
			'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n" .
			'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' .
			'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>' .
			'<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>' .
			'<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' .
			'</Relationships>'
		);

		$zip->addFromString('xl/worksheets/sheet1.xml', $wsXml);
		$zip->addFromString('xl/sharedStrings.xml', $ssXml);
		$zip->addFromString('xl/styles.xml', $stylesXml);

		$zip->close();

		$content = file_get_contents($tmpFile);
		unlink($tmpFile);

		return $content;
	}

	/**
	 * Convert a 0-based column index to an Excel column letter (A, B, …, Z, AA, AB, …)
	 */
	private static function colLetter(int $index): string {
		$letter = '';
		while ($index >= 0) {
			$letter = chr(65 + ($index % 26)) . $letter;
			$index  = intval($index / 26) - 1;
		}
		return $letter;
	}
}
