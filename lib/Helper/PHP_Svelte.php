<?php

namespace OCA\TimeManager\Helper;

class PHP_Svelte {
    /**
     * @deprecated This function is a no-op.
     * SSR of regular Svelte components using simple regular expressions did not work very well.
     * Due to Svelte's every improving syntax, it led to incomplete HTML.
     * This was in turn causing rendering issues. Therefore, this experiment ends here.
     */
	static function render_template(string $filename = "", array $props = []): string {
		return "";
	}
}
