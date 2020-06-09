<?php

namespace OCA\TimeManager\Helper;

class PHP_Svelte {
	static function render_template($filename = '', $props = []) {
		$location = dirname(__FILE__) . '/../js/views/' . $filename;
		if ($location) {
			$template = file_get_contents(dirname(__FILE__) . '/../js/views/' . $filename);
			if ($template) {
				// Strip script and style tags
				$rendered_template = preg_replace('@<(script|style)[^>]*?>.*?</\\1>@si', '', $template);
				// Remove binds
				$rendered_template = preg_replace('/bind\:(.*?)={(.*?)}/', '', $rendered_template);
				// Remove if statements
				$rendered_template = preg_replace('/{\#if((?s).*){\/if}/', '', $rendered_template);
				// Replace all variables in tag attributes and wrap in quotes
				$rendered_template = PHP_Svelte::replace_in_template('/={(.*?)}/', $props, $rendered_template, true);
				// Replace all other variables
				$rendered_template = PHP_Svelte::replace_in_template('/{(.*?)}/', $props, $rendered_template, false);

				return $rendered_template;
			}
		}
	}

	/**
	 * Replaces all `{props}` in a template string.
	 */
	static function replace_in_template($regex, $props, $template, $quotes) {
		$template_props = preg_match_all($regex, $template, $matches);
		if ($matches && count($matches) > 1) {
			foreach ($matches[1] as $match) {
				if (isset($props[$match])) {
					$replacement = is_string($props[$match]) ? $props[$match] : json_encode($props[$match]);
					if ($quotes) {
						$template = preg_replace('/{' . $match . '}/', '"' . $replacement . '"', $template);
					} else {
						$template = preg_replace('/{' . $match . '}/', $replacement, $template);
					}
				} else {
					$template = str_replace('{' . $match . '}', "", $template);
				}
			}
		}

		return $template;
	}
}
