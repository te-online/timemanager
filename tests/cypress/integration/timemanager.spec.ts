import { dataset } from "../fixtures/test-data";
const clients = dataset.filter((data) => data.Type === "Client");
const projects = dataset.filter((data) => data.Type === "Project");
const tasks = dataset.filter((data) => data.Type === "Task");
const testusers = ["import-test", "testuser-1", "testuser-2"];

describe("TimeManager", () => {
	// eslint-disable-next-line no-undef
	beforeEach(() => {
		// Log in
		cy.visit("/");
		cy.get('input[name="user"]').type(Cypress.env("NEXTCLOUD_ADMIN_USER"));
		cy.get('input[name="password"]').type(Cypress.env("NEXTCLOUD_ADMIN_PASSWORD"));
		cy.get('input[type="submit"]').click();
	});

	it("can create test users", () => {
		cy.visit("/settings/users");
		for (const username of testusers) {
			// It can take a while until the user from the previous run is created
			cy.get("button#new-user-button", { timeout: 4000 }).click({ timeout: 30000 });
			cy.get('input[name="username"]').type(username);
			cy.get('input[name="password"]').type(`${username}-password`);
			cy.contains("button", "Add a new user", { timeout: 4000 }).click();
		}
	});

	it("can activate app", () => {
		cy.visit("/settings/apps");
		cy.get(".apps-list-container div.section").contains("TimeManager").parent().find("input[value='Enable']").click();
		cy.wait(2000);
	});

	it("can import from a CSV file", () => {
		// Log out admin user
		cy.get("div#settings div#expand").click({ timeout: 4000 });
		cy.get('[data-id="logout"] > a').click({ timeout: 4000 });
		cy.reload(true);

		// Log in as import test user
		cy.get('input[name="user"]', { timeout: 4000 }).type("import-test");
		cy.get('input[name="password"]').type("import-test-password");
		cy.get('input[type="submit"]').click();
		cy.wait(2000);

		// Navigate to tools page
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Tools").click();

		// Select file
		cy.get('input[type="file"]', { timeout: 4000 }).selectFile("cypress/fixtures/test-data.csv");

		// Check counts in preview
		cy.contains("dt", "Clients").siblings("dd").contains(clients.length).should("be.visible");
		cy.contains("dt", "Projects").siblings("dd").contains(projects.length).should("be.visible");
		cy.contains("dt", "Tasks").siblings("dd").contains(tasks.length).should("be.visible");
		cy.contains("button", "Import now").click();

		// Inspect rows of clients after import
		cy.get("a").contains("Clients").click();
		cy.get("div.tm_item-row", { timeout: 4000 }).should("have.length", clients.length);

		// Rows of projects
		const testClient = clients[0];
		cy.contains("div.tm_item-row", testClient.Name, { timeout: 4000 }).click();
		cy.get("div.tm_item-row", { timeout: 4000 }).should(
			"have.length",
			projects.filter((project) => project.Client === testClient.Name).length
		);

		// Rows of tasks
		const testProject = projects.filter((project) => project.Client === testClient.Name)[0];
		cy.contains("div.tm_item-row", testProject.Name, { timeout: 4000 }).click();
		cy.get("div.tm_item-row", { timeout: 4000 }).should(
			"have.length",
			tasks.filter((task) => task.Project === testProject.Name).length
		);
	});

	it("can create clients", () => {
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		for (const [index, client] of clients.entries()) {
			cy.wait(1000);
			cy.contains("a", "Add client", { timeout: 4000 }).click();
			cy.get('input[name="name"]').type(client.Name);
			cy.get('textarea[name="note"]').type("Some client note");
			cy.get(".oc-dialog form").submit();
			cy.wait(1000);
			cy.contains("div.tm_item-row", client.Name, { timeout: 4000 }).should("be.visible");
			cy.get("div.tm_item-row", { timeout: 4000 }).should("have.length", index + 1);
		}
	});

	it("can edit client", () => {
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();

		const secondClient = clients[1];
		cy.contains("div.tm_item-row", secondClient.Name, { timeout: 4000 }).click();
		cy.wait(1000);

		cy.contains("a", "Edit client", { timeout: 4000 }).click();
		cy.get('input[name="name"]').type(" (changed)");
		cy.get('textarea[name="note"]').type(" (note updated)");
		cy.contains("button", "Edit client").click();

		cy.wait(1000);
		cy.contains("span.tm_label", "Client").parent().contains(`${secondClient.Name} (changed)`).should("be.visible");
		cy.contains("span.tm_label", "Note").parent().contains("Some client note (note updated)").should("be.visible");

		cy.get("a").contains("Clients").click();
		cy.get("div.tm_item-row", { timeout: 4000 }).should("have.length", clients.length);
		cy.contains("div.tm_item-row", `${secondClient.Name} (changed)`, { timeout: 4000 }).should("be.visible");
	});

	it("can delete client", () => {
		const firstClient = clients[0];

		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();

		cy.contains("div.tm_item-row", firstClient.Name, { timeout: 4000 }).click();
		cy.wait(2000);
		cy.contains("button", "Delete client", { timeout: 4000 }).click();
		cy.contains("button", "Delete", { timeout: 4000 }).click();
		cy.get("div.tm_item-row", { timeout: 4000 }).should("have.length", clients.length - 1);
	});

	it("can create projects on a client", () => {
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		const secondClient = clients[1];
		cy.contains("div.tm_item-row", secondClient.Name, { timeout: 4000 }).click();

		for (const [index, project] of projects.entries()) {
			cy.wait(1000);
			cy.contains("a", "Add project", { timeout: 4000 }).click();
			cy.get('input[name="name"]').type(project.Name);
			cy.get(".oc-dialog form").submit();
			cy.wait(1000);
			cy.contains("div.tm_item-row", project.Name, { timeout: 4000 }).should("be.visible");
			cy.get("div.tm_item-row", { timeout: 4000 }).should("have.length", index + 1);
		}
	});

	it("can edit project on a client", () => {
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		const secondClient = clients[1];
		cy.contains("div.tm_item-row", secondClient.Name, { timeout: 4000 }).click();
		cy.wait(1000);

		const thirdProject = projects[2];
		cy.contains("div.tm_item-row", thirdProject.Name, { timeout: 4000 }).click();
		cy.contains("a", "Edit project", { timeout: 4000 }).click();
		cy.get('input[name="name"]').type(" (changed)");
		cy.contains("button", "Edit project").click();

		cy.wait(1000);
		cy.contains("span.tm_label", "Project").parent().contains(`${thirdProject.Name} (changed)`).should("be.visible");

		cy.get("a").contains(secondClient.Name).click();
		cy.get("div.tm_item-row", { timeout: 4000 }).should("have.length", projects.length);
		cy.contains("div.tm_item-row", `${thirdProject.Name} (changed)`, { timeout: 4000 }).should("be.visible");
	});

	it("can delete project on a client", () => {
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		const secondClient = clients[1];
		cy.contains("div.tm_item-row", secondClient.Name, { timeout: 4000 }).click();
		cy.wait(1000);

		const secondProject = projects[1];
		cy.contains("div.tm_item-row", secondProject.Name, { timeout: 4000 }).click();
		cy.wait(1000);

		cy.contains("button", "Delete project", { timeout: 4000 }).click();
		cy.contains("button", "Delete", { timeout: 4000 }).click();
		cy.get("div.tm_item-row", { timeout: 4000 }).should("have.length", projects.length - 1);
	});

	// it("can create task on a project", () => {});

	// it("can edit task on a project", () => {});

	// it("can delete task on a project", () => {});

	// it("can create time entry", () => {});

	// it("can edit time entry", () => {});

	// it("can check time entry", () => {});

	// it("can uncheck time entry", () => {});

	// it("can delete time entry", () => {});

	// it("can display correct totals", () => {});

	// it("can share clients", () => {});

	// it("can see clients, projects, tasks shared with me", () => {});

	// it("can see all time entries in shared clients", () => {});

	// it("cannot see other's time entries in shared clients", () => {});

	// it("cannot edit/delete clients, projects, tasks shared with me", () => {});

	// it("cannot edit/delete other's time entries", () => {});

	// it("can get API response with created, updated, deleted items", () => {});

	// it("API response doesn't include time entries on shared clients", () => {});

	// it("cannot send created, updated, deleted items for shared clients", () => {});

	// it("cannot access unshared clients or time entries", () => {});

	// it("can access time entries for previously shared client", () => {});
});
