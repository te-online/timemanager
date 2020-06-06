export class Helpers {
	// Helps replacing a SSR node with a Svelte component
	static replaceNode(node) {
		if (node) {
			node.innerHTML = "";
		}
		return node;
	}
}
