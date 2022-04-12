import { dataset, timeEntries, sharedTimeEntries, testusers } from "../fixtures/test-data";
const clients = dataset.filter((data) => data.Type === "Client");
const projects = dataset.filter((data) => data.Type === "Project");
const tasks = dataset.filter((data) => data.Type === "Task");

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

	it("can share clients", () => {
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		const firstClient = clients[0];
		cy.contains("div.tm_item-row", firstClient.Name, { timeout: 4000 }).click();
		cy.wait(1000);

		for (const username of testusers.slice(1)) {
			cy.contains("button", "Share client", { timeout: 4000 }).click();
			cy.get("input#sharee-select").type(username);
			cy.get("label.sharees .item.first", { timeout: 4000 }).click();
			cy.contains("button", "Add", { timeout: 4000 }).click();

			cy.wait(1000);
			cy.contains("span.tm_label", "Shared with").parent().contains(username).should("be.visible");
		}

		cy.get("a").contains("Clients").click();
		const thirdClient = clients[2];
		cy.contains("div.tm_item-row", thirdClient.Name, { timeout: 4000 }).click();
		cy.wait(1000);

		for (const username of testusers.slice(1)) {
			cy.contains("button", "Share client", { timeout: 4000 }).click();
			cy.get("input#sharee-select").type(username);
			cy.get("label.sharees .item.first", { timeout: 4000 }).click();
			cy.contains("button", "Add", { timeout: 4000 }).click();

			cy.wait(1000);
			cy.contains("span.tm_label", "Shared with").parent().contains(username).should("be.visible");
		}
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

	it("can create projects on clients", () => {
		cy.visit("/apps/timemanager");
		for (const client of clients.filter(({}, index) => index !== 0)) {
			cy.get("a").contains("Clients").click();
			cy.wait(1000);
			cy.contains("div.tm_item-row", client.Name, { timeout: 4000 }).click();

			for (const [index, project] of projects.filter((project) => project.Client === client.Name).entries()) {
				cy.wait(1000);
				cy.contains("a", "Add project", { timeout: 4000 }).click();
				cy.get('input[name="name"]').type(project.Name);
				cy.get(".oc-dialog form").submit();
				cy.wait(1000);
				cy.contains("div.tm_item-row", project.Name, { timeout: 4000 }).should("be.visible");
				cy.get("div.tm_item-row", { timeout: 4000 }).should("have.length", index + 1);
			}
		}
	});

	it("can edit project on a client", () => {
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		const secondClient = clients[1];
		cy.contains("div.tm_item-row", secondClient.Name, { timeout: 4000 }).click();
		cy.wait(1000);

		const thirdProject = projects.filter((project) => project.Client === secondClient.Name)[2];
		cy.contains("div.tm_item-row", thirdProject.Name, { timeout: 4000 }).click();
		cy.wait(1000);

		cy.contains("a", "Edit project", { timeout: 4000 }).click();
		cy.get('input[name="name"]').type(" (changed)");
		cy.contains("button", "Edit project").click();

		cy.wait(1000);
		cy.contains("span.tm_label", "Project").parent().contains(`${thirdProject.Name} (changed)`).should("be.visible");

		cy.get("a").contains(secondClient.Name).click();
		cy.get("div.tm_item-row", { timeout: 4000 }).should(
			"have.length",
			projects.filter((project) => project.Client === secondClient.Name).length
		);
		cy.contains("div.tm_item-row", `${thirdProject.Name} (changed)`, { timeout: 4000 }).should("be.visible");
	});

	it("can delete project on a client", () => {
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		const secondClient = clients[1];
		cy.contains("div.tm_item-row", secondClient.Name, { timeout: 4000 }).click();
		cy.wait(1000);

		const secondProject = projects.filter((project) => project.Client === secondClient.Name)[1];
		cy.contains("div.tm_item-row", secondProject.Name, { timeout: 4000 }).click();
		cy.wait(1000);

		cy.contains("button", "Delete project", { timeout: 4000 }).click();
		cy.contains("button", "Delete", { timeout: 4000 }).click();
		cy.get("div.tm_item-row", { timeout: 4000 }).should(
			"have.length",
			projects.filter((project) => project.Client === secondClient.Name).length - 1
		);
	});

	it("can create tasks on projects", () => {
		cy.visit("/apps/timemanager");

		for (const [clientIndex, client] of clients.entries()) {
			if (clientIndex === 0) {
				// Client got deleted earlier, skip
				continue;
			}
			cy.get("a").contains("Clients").click();
			cy.wait(1000);
			cy.contains("div.tm_item-row", client.Name, { timeout: 4000 }).click();

			for (const [projectIndex, project] of projects
				.filter((project) => project.Client === client.Name)
				// .slice(0, 5)
				.entries()) {
				if (clientIndex === 1 && projectIndex === 1) {
					// Project got deleted earlier, skip
					continue;
				}
				if (projectIndex > 0) {
					cy.get("a").contains(client.Name).click();
					cy.wait(1000);
				}
				cy.contains("div.tm_item-row", project.Name, { timeout: 4000 }).click();

				for (const [index, task] of tasks
					.filter((task) => task.Project === project.Name)
					// .slice(0, 3)
					.entries()) {
					if (index > 0) {
						cy.get("a").contains(project.Name).click();
						cy.wait(1000);
					}
					cy.wait(1000);
					cy.contains("a", "Add task", { timeout: 4000 }).click();
					cy.get('input[name="name"]').type(task.Name);
					cy.get(".oc-dialog form").submit();
					cy.wait(1000);
					cy.contains("div.tm_item-row", task.Name, { timeout: 4000 }).should("be.visible");
					cy.get("div.tm_item-row", { timeout: 4000 }).should("have.length", index + 1);
				}
			}
		}
	});

	it("can edit task on a project", () => {
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		const secondClient = clients[1];
		cy.contains("div.tm_item-row", secondClient.Name, { timeout: 4000 }).click();
		cy.wait(1000);

		const fifthProject = projects.filter((project) => project.Client === secondClient.Name)[4];
		cy.contains("div.tm_item-row", fifthProject.Name, { timeout: 4000 }).click();
		cy.wait(1000);

		const thirdTask = tasks.filter((task) => task.Project === fifthProject.Name)[2];
		cy.contains("div.tm_item-row", thirdTask.Name, { timeout: 4000 }).click();
		cy.wait(1000);

		cy.contains("a", "Edit task", { timeout: 4000 }).click();
		cy.get('input[name="name"]').type(" (changed)");
		cy.contains("button", "Edit task").click();

		cy.wait(1000);
		cy.contains("span.tm_label", "Task").parent().contains(`${thirdTask.Name} (changed)`).should("be.visible");

		cy.get("a").contains(fifthProject.Name).click();
		cy.get("div.tm_item-row", { timeout: 4000 }).should(
			"have.length",
			tasks.filter((task) => task.Project === fifthProject.Name).length
		);
		cy.contains("div.tm_item-row", `${thirdTask.Name} (changed)`, { timeout: 4000 }).should("be.visible");
	});

	it("can delete task on a project", () => {
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		const secondClient = clients[1];
		cy.contains("div.tm_item-row", secondClient.Name, { timeout: 4000 }).click();
		cy.wait(1000);

		const fifthProject = projects.filter((project) => project.Client === secondClient.Name)[4];
		cy.contains("div.tm_item-row", fifthProject.Name, { timeout: 4000 }).click();
		cy.wait(1000);

		const thirdTask = tasks.filter((task) => task.Project === fifthProject.Name)[2];
		cy.contains("div.tm_item-row", thirdTask.Name, { timeout: 4000 }).click();
		cy.wait(1000);

		cy.contains("button", "Delete task", { timeout: 4000 }).click();
		cy.contains("button", "Delete", { timeout: 4000 }).click();
		cy.get("div.tm_item-row", { timeout: 4000 }).should(
			"have.length",
			tasks.filter((task) => task.Project === fifthProject.Name).length - 1
		);
	});

	it("can create time entries", () => {
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		const secondClient = clients[1];
		cy.contains("div.tm_item-row", secondClient.Name, { timeout: 4000 }).click();
		cy.wait(1000);

		const firstProject = projects.filter((project) => project.Client === secondClient.Name)[0];
		cy.contains("div.tm_item-row", firstProject.Name, { timeout: 4000 }).click();
		cy.wait(1000);

		const firstTask = tasks.filter((task) => task.Project === firstProject.Name)[0];
		cy.contains("div.tm_item-row", firstTask.Name, { timeout: 4000 }).click();
		cy.wait(1000);

		for (const [index, timeEntry] of timeEntries.entries()) {
			cy.wait(1000);
			cy.contains("a", "Add time entry", { timeout: 4000 }).click();
			cy.get('input[name="duration"]').type(timeEntry.time);
			cy.get('input[name="date"]').type(timeEntry.date);
			cy.get('textarea[name="note"]').type(timeEntry.note);
			cy.get(".oc-dialog form").submit();
			cy.wait(1000);
			cy.contains("div.tm_item-row", timeEntry.time.replace(",", "."), { timeout: 4000 }).should("be.visible");
			cy.contains("div.tm_item-row", timeEntry.note, { timeout: 4000 }).should("be.visible");
			cy.contains("div.tm_item-row", timeEntry.formattedDate, { timeout: 4000 }).should("be.visible");
			cy.get("div.tm_item-row", { timeout: 4000 }).should("have.length", index + 1);
		}
	});

	it("can create time entries in shared client", () => {
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		const thirdClient = clients[2];
		cy.contains("div.tm_item-row", thirdClient.Name, { timeout: 4000 }).click();
		cy.wait(1000);

		const firstProject = projects.filter((project) => project.Client === thirdClient.Name)[0];
		cy.contains("div.tm_item-row", firstProject.Name, { timeout: 4000 }).click();
		cy.wait(1000);

		const firstTask = tasks.filter((task) => task.Project === firstProject.Name)[0];
		cy.contains("div.tm_item-row", firstTask.Name, { timeout: 4000 }).click();
		cy.wait(1000);

		for (const [index, timeEntry] of sharedTimeEntries.entries()) {
			cy.wait(1000);
			cy.contains("a", "Add time entry", { timeout: 4000 }).click();
			cy.get('input[name="duration"]').type(timeEntry.time);
			cy.get('input[name="date"]').type(timeEntry.date);
			cy.get('textarea[name="note"]').type(timeEntry.note);
			cy.get(".oc-dialog form").submit();
			cy.wait(1000);
			cy.contains("div.tm_item-row", timeEntry.time.replace(",", "."), { timeout: 4000 }).should("be.visible");
			cy.contains("div.tm_item-row", timeEntry.note, { timeout: 4000 }).should("be.visible");
			cy.contains("div.tm_item-row", timeEntry.formattedDate, { timeout: 4000 }).should("be.visible");
			cy.get("div.tm_item-row", { timeout: 4000 }).should("have.length", index + 1);
		}
	});

	it("can edit time entry", () => {
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		const secondClient = clients[1];
		cy.contains("div.tm_item-row", secondClient.Name, { timeout: 4000 }).click();
		cy.wait(1000);

		const firstProject = projects.filter((project) => project.Client === secondClient.Name)[0];
		cy.contains("div.tm_item-row", firstProject.Name, { timeout: 4000 }).click();
		cy.wait(1000);

		const firstTask = tasks.filter((task) => task.Project === firstProject.Name)[0];
		cy.contains("div.tm_item-row", firstTask.Name, { timeout: 4000 }).click();
		cy.wait(1000);

		const secondTimeEntry = timeEntries[1];
		cy.contains("div.tm_item-row", secondTimeEntry.note, { timeout: 4000 })
			.invoke("show")
			.contains("button", "Edit")
			.click();
		cy.wait(1000);

		cy.get('input[name="duration"]').clear().type("5.75");
		cy.get('input[name="date"]').clear().type("2021-03-26");
		cy.get('textarea[name="note"]').type(" (changed)");
		cy.get(".oc-dialog form").submit();

		cy.wait(1000);
		cy.contains("div.tm_item-row", `${secondTimeEntry.note} (changed)`).should("be.visible");
		cy.get("div.tm_item-row", { timeout: 4000 }).should("have.length", timeEntries.length);
	});

	it("can mark time entry", () => {
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		const secondClient = clients[1];
		cy.contains("div.tm_item-row", secondClient.Name, { timeout: 4000 }).click();
		cy.wait(1000);

		const firstProject = projects.filter((project) => project.Client === secondClient.Name)[0];
		cy.contains("div.tm_item-row", firstProject.Name, { timeout: 4000 }).click();
		cy.wait(1000);

		const firstTask = tasks.filter((task) => task.Project === firstProject.Name)[0];
		cy.contains("div.tm_item-row", firstTask.Name, { timeout: 4000 }).click();
		cy.wait(1000);

		const firstTimeEntry = timeEntries[0];
		cy.contains("div.tm_item-row", firstTimeEntry.note)
			.get('.checkbox-action input[type="checkbox"]', { timeout: 4000 })
			.click();

		cy.wait(1000);
		cy.contains("div.tm_item-row", firstTimeEntry.note).should("be.visible");
		expect(cy.contains("div.tm_item-row", firstTimeEntry.note).get('input[type="checkbox"]')).to.be.checked;
		cy.get("div.tm_item-row", { timeout: 4000 }).should("have.length", timeEntries.length);

		// See if status survives a page refresh
		cy.reload(true);

		cy.contains("div.tm_item-row", firstTimeEntry.note).should("be.visible");
		expect(cy.contains("div.tm_item-row", firstTimeEntry.note).get('input[type="checkbox"]')).to.be.checked;
		cy.get("div.tm_item-row", { timeout: 4000 }).should("have.length", timeEntries.length);
	});

	it("can unmark time entry", () => {
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		const secondClient = clients[1];
		cy.contains("div.tm_item-row", secondClient.Name, { timeout: 4000 }).click();
		cy.wait(1000);

		const firstProject = projects.filter((project) => project.Client === secondClient.Name)[0];
		cy.contains("div.tm_item-row", firstProject.Name, { timeout: 4000 }).click();
		cy.wait(1000);

		const firstTask = tasks.filter((task) => task.Project === firstProject.Name)[0];
		cy.contains("div.tm_item-row", firstTask.Name, { timeout: 4000 }).click();
		cy.wait(1000);

		const firstTimeEntry = timeEntries[0];
		cy.contains("div.tm_item-row", firstTimeEntry.note)
			.get('.checkbox-action input[type="checkbox"]', { timeout: 4000 })
			.click();

		cy.wait(1000);
		cy.contains("div.tm_item-row", firstTimeEntry.note).should("be.visible");
		expect(cy.contains("div.tm_item-row", firstTimeEntry.note).get('input[type="checkbox"]')).not.to.be.checked;
		cy.get("div.tm_item-row", { timeout: 4000 }).should("have.length", timeEntries.length);

		// See if status survives a page refresh
		cy.reload(true);

		cy.contains("div.tm_item-row", firstTimeEntry.note).should("be.visible");
		expect(cy.contains("div.tm_item-row", firstTimeEntry.note).get('input[type="checkbox"]')).not.to.be.checked;
		cy.get("div.tm_item-row", { timeout: 4000 }).should("have.length", timeEntries.length);
	});

	it("can delete time entry", () => {
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		const secondClient = clients[1];
		cy.contains("div.tm_item-row", secondClient.Name, { timeout: 4000 }).click();
		cy.wait(1000);

		const firstProject = projects.filter((project) => project.Client === secondClient.Name)[0];
		cy.contains("div.tm_item-row", firstProject.Name, { timeout: 4000 }).click();
		cy.wait(1000);

		const firstTask = tasks.filter((task) => task.Project === firstProject.Name)[0];
		cy.contains("div.tm_item-row", firstTask.Name, { timeout: 4000 }).click();
		cy.wait(1000);

		const secondTimeEntry = timeEntries[1];
		cy.contains("div.tm_item-row", secondTimeEntry.note, { timeout: 4000 })
			.invoke("show")
			.contains("button", "Delete")
			.click();
		cy.wait(1000);

		cy.wait(1000);
		cy.contains("div.tm_item-row", `${secondTimeEntry.note} (changed)`).should("not.be.visible");
		cy.get("div.tm_item-row", { timeout: 4000 }).should("have.length", timeEntries.length - 1);
	});

	// it("can display correct totals", () => {});

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
