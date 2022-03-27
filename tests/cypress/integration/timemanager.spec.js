const clients = ["McGlynn Group", "Crooks-Gulgowski", "Grimes, Cronin and Cruickshank"];

describe("TimeManager", () => {
	// eslint-disable-next-line no-undef
	before(() => {
		// Log in
		cy.visit("/");
		cy.get('input[name="user"]').type(Cypress.env("NEXTCLOUD_ADMIN_USER"));
		cy.get('input[name="password"]').type(Cypress.env("NEXTCLOUD_ADMIN_PASSWORD"));
		cy.get('input[type="submit"]').click();
		// Dismiss first run wizard
		cy.get('button[icon="icon-close"]', { timeout: 4000 }).contains("Close").click({ force: true });
		cy.wait(2000);
		// @TODO: Create test users
	});

	// eslint-disable-next-line no-undef
	beforeEach(() => {
		Cypress.Cookies.preserveOnce(
			"nc_sameSiteCookielax",
			"nc_session_id",
			"nc_token",
			"nc_username",
			"oc_sessionPassphrase"
		);
	});

	it("can activate app", () => {
		cy.visit("/settings/apps");
		cy.get(".apps-list-container div.section").contains("TimeManager").parent().find("input[value='Enable']").click();
	});

	it("can create clients", () => {
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		for (const [index, clientName] of clients.entries()) {
			cy.wait(1000);
			cy.contains("a", "Add client", { timeout: 4000 }).click();
			cy.get('input[name="name"]').type(clientName);
			cy.get('textarea[name="note"]').type("Some client note");
			cy.get(".oc-dialog form").submit();
			cy.wait(1000);
			cy.contains("div.tm_item-row", clientName, { timeout: 4000 }).should("be.visible");
			cy.get("div.tm_item-row", { timeout: 4000 }).should("have.length", index + 1);
		}
	});

	it("can edit client", () => {});

	it("can delete clients", () => {});

	it("can create projects on a client", () => {});

	it("can edit projects on a client", () => {});

	it("can delete projects on a client", () => {});

	it("can create task on a project", () => {});

	it("can edit task on a project", () => {});

	it("can delete task on a project", () => {});

	it("can create time entry", () => {});

	it("can edit time entry", () => {});

	it("can check time entry", () => {});

	it("can uncheck time entry", () => {});

	it("can delete time entry", () => {});

	it("can display correct totals", () => {});

	it("can share clients", () => {});

	it("can see clients, projects, tasks shared with me", () => {});

	it("can see all time entries in shared clients", () => {});

	it("cannot see other's time entries in shared clients", () => {});

	it("cannot edit/delete clients, projects, tasks shared with me", () => {});

	it("cannot edit/delete other's time entries", () => {});

	it("can get API response with created, updated, deleted items", () => {});

	it("API response doesn't include time entries on shared clients", () => {});

	it("cannot send created, updated, deleted items for shared clients", () => {});

	it("cannot access unshared clients or time entries", () => {});

	it("can access time entries for previously shared client", () => {});
});
