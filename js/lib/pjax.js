import Pjax from "pjax";
import { generateUrl } from "@nextcloud/router";

export class PagePjax {
	constructor(reload) {
		/**
		 * Enable seamless page navigation with pjax.
		 */
		this.pjaxInstance = new Pjax({
			elements: [".timemanager-pjax-link"],
			selectors: [".app-timemanager #app-navigation ul", ".app-timemanager #app-content .container"],
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

		document.addEventListener("pjax:error", (error) => {
			// Catch session timeout and redirect to login
			if (error && error.request && error.request.status === 401) {
				document.location.href = `${generateUrl("login")}?redirect_url=${generateUrl("timemanager", "index")}`;
			}
			document.body.classList.remove("loading");
			document.body.classList.add("loading-error");
		});
	}
}
