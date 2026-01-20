<?php

namespace OCA\TimeManager\Helper;

class DurationHelper {
    static function format_duration(float $duration, string $encoded_store): string | null {
        $store = json_decode($encoded_store, true);
        $inputMethod = $store["settings"]["timemanager_input_method"];
        if ($inputMethod === InputMethods::Minutes) {
            return self::format_decimal_duration_as_time($duration);
        }

        return "" . $duration;
    }

    static function format_decimal_duration_as_time(float $decimal_duration): string | null {
        if (!$decimal_duration) {
            return $decimal_duration;
        }

        $duration_parts = explode(".", (string) $decimal_duration);
        $hours_decimal = $duration_parts[0];
        $minutes_decimal = $duration_parts[1];

        $minutes_multiplier = round((float) ("0." . $minutes_decimal), 2);
        $minutes = round($minutes_multiplier * 60);

		if ($minutes < 10) {
            $minutes = "0" . $minutes;
        }

        $hours = (float) $hours_decimal;
		if ($hours < 10) {
            $hours = "0" . $hours;
        }

		return $hours . ":" . $minutes;
    }
}