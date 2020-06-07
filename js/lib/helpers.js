export class Helpers {
	// Helps replacing a SSR node with a Svelte component
	static replaceNode(node) {
		if (node) {
			node.innerHTML = "";
		}
		return node;
	}

	static hideFallbacks(fileName) {
		const nodes = document.querySelectorAll(`[data-svelte-hide="${fileName}"]`);
		if (nodes && nodes.length) {
			nodes.forEach((node) => node.remove());
		}
	}
}
