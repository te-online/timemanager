import Pjax from "pjax";

export class PagePjax {
	constructor(reload) {
		/**
		 * Enable seamless page navigation with pjax.
		 */
		this.pjaxInstance = new Pjax({
			elements: [".timemanager-pjax-link"],
			selectors: [".app-timemanager #app-navigation", ".app-timemanager #app-content"],
			cacheBust: false,
			scrollTo: true,
		});

		document.addEventListener("pjax:send", () => {
			document.body.classList.add("loading");
			document.body.classList.remove("loading-error");
		});

		document.addEventListener("pjax:success", () => {
			setTimeout(() => {
				document.body.classList.remove("loading");
				reload();
			}, 300);
		});

		document.addEventListener("pjax:error", () => {
			document.body.classList.remove("loading");
			document.body.classList.add("loading-error");
		});
	}
}
