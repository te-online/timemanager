import { differenceInMinutes, format, parse } from "date-fns";
import {
	dataset,
	timeEntries,
	sharedTimeEntries,
	testusers,
	timeEntriesTotalFormatted,
	sharedTimeEntriesFormatted,
} from "../fixtures/test-data";
const clients = dataset.filter((data) => data.Type === "Client");
const allProjects = dataset.filter((data) => data.Type === "Project");
const projects: typeof dataset = [];
allProjects.forEach((project) => {
	// Add max 5 projects per client
	if (projects.filter((oneP) => oneP.Client === project.Client).length <= 5) {
		projects.push(project);
	}
});
const allTasks = dataset.filter((data) => data.Type === "Task");
const tasks: typeof dataset = [];
allTasks.forEach((task) => {
	// Add max 3 tasks per project
	if (tasks.filter((oneT) => oneT.Project === task.Project).length <= 5) {
		tasks.push(task);
	}
});

const waitForOcDialog = () => {
	// @TODO: OC-Dialog auto-closes if opened too earlier after page-load
	cy.wait(500);
};

const waitForPjax = () => {
	cy.get("body").should((body) => expect(body).to.not.have.class("tm_ready"));
	cy.get("body").should((body) => expect(body).to.have.class("tm_ready"));
};

describe("TimeManager", { defaultCommandTimeout: 5000 }, () => {
	beforeEach(() => {
		// Log in
		cy.visit("/");
		cy.get('input[name="user"]').type(Cypress.env("NEXTCLOUD_ADMIN_USER"));
		cy.get('input[name="password"]').type(Cypress.env("NEXTCLOUD_ADMIN_PASSWORD"));
		cy.get('[type="submit"]').click();
	});

	it("can create test users", () => {
		cy.visit("/settings/users");
		for (const username of testusers) {
			// It can take a while until the user from the previous run is created
			cy.get("button#new-user-button").click({ timeout: 30000 });
			cy.get('input[name="username"]').type(username);
			cy.get('input[name="password"]').type(`${username}-password`);
			cy.contains("button", "Add a new user").click();
		}
	});

	it("can activate app", () => {
		cy.visit("/settings/apps");
		if (Cypress.env("NC_VERSION") && Cypress.env("NC_VERSION") >= 25) {
			cy.get(".apps-list-container div.section")
				.contains("TimeManager")
				.parent()
				.within(() => {
					cy.contains("Enable").click();
				});
			cy.get(".apps-list-container div.section")
				.contains("TimeManager")
				.parent()
				.within(() => {
					cy.contains("Enable").should("not.exist");
				});
		} else {
			cy.get(".apps-list-container div.section").contains("TimeManager").parent().find("input[value='Enable']").click();
			cy.get(".apps-list-container div.section")
				.contains("TimeManager")
				.parent()
				.find("input[value='Enable']")
				.should("not.exist");
		}
	});

	it("can import from a CSV file", () => {
		// Log out admin user
		cy.get("div#settings div#expand").click({ timeout: 4000 });
		cy.get('[data-id="logout"] > a').click({ timeout: 4000 });
		cy.reload(true);

		// Log in as import test user
		cy.get('input[name="user"]').type("import-test");
		cy.get('input[name="password"]').type("import-test-password");
		cy.get('[type="submit"]').click();
		cy.contains("#app-dashboard", "Recommended files").scrollIntoView().should("be.visible");

		// Navigate to tools page
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Tools").click();

		// Select file
		cy.get('input[type="file"]').selectFile("cypress/fixtures/test-data.csv");
		cy.contains("button", "Generate preview from file").click();

		// Check counts in preview
		cy.contains("dt", "Clients").siblings("dd").contains(clients.length).scrollIntoView().should("be.visible");
		cy.contains("dt", "Projects").siblings("dd").contains(allProjects.length).scrollIntoView().should("be.visible");
		cy.contains("dt", "Tasks").siblings("dd").contains(allTasks.length).scrollIntoView().should("be.visible");
		cy.contains("button", "Import now").click();

		waitForOcDialog();
		cy.contains(".oc-dialog", "Import successful").scrollIntoView().should("be.visible");
		cy.contains("Done:").scrollIntoView().should("be.visible");
		cy.contains("button", "Close").click();
		waitForOcDialog();

		// Inspect rows of clients after import
		cy.get("a").contains("Clients").click();
		cy.get("div.tm_item-row").should("have.length", clients.length);

		// Rows of projects
		const testClient = clients[0];
		cy.contains("div.tm_item-row", testClient.Name).click();
		cy.get("div.tm_item-row").should(
			"have.length",
			allProjects.filter((project) => project.Client === testClient.Name).length
		);

		// Rows of tasks
		const testProject = allProjects.filter((project) => project.Client === testClient.Name)[0];
		cy.contains("div.tm_item-row", testProject.Name).click();
		cy.get("div.tm_item-row").should(
			"have.length",
			allTasks.filter((task) => task.Project === testProject.Name).length
		);
	});

	it("shows an error message if CSV cannot be parsed", () => {
		// Log out admin user
		cy.get("div#settings div#expand").click({ timeout: 4000 });
		cy.get('[data-id="logout"] > a').click({ timeout: 4000 });
		cy.reload(true);

		// Log in as import test user
		cy.get('input[name="user"]').type("import-test");
		cy.get('input[name="password"]').type("import-test-password");
		cy.get('[type="submit"]').click();
		cy.contains("#app-dashboard", "Recommended files").scrollIntoView().should("be.visible");

		// Navigate to tools page
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Tools").click();

		// Select file
		cy.get('select[name="delimiter"]').select(";");
		cy.get('input[type="file"]').selectFile("cypress/fixtures/unreadable.csv");
		cy.contains("button", "Generate preview from file").click();

		waitForOcDialog();
		cy.contains(".oc-dialog", "Error reading CSV file").scrollIntoView().should("be.visible");
		cy.contains("It looks like this file is not a CSV file or doesn't contain any clients, projects or tasks.").should(
			"be.visible"
		);
		cy.contains("button", "Close").click();
		waitForOcDialog();
		cy.contains(".oc-dialog", "Error reading CSV file").should("not.exist");
	});

	it("can import CSV file with semicolon delimiter", () => {
		// Log out admin user
		cy.get("div#settings div#expand").click({ timeout: 4000 });
		cy.get('[data-id="logout"] > a').click({ timeout: 4000 });
		cy.reload(true);

		// Log in as import test user
		cy.get('input[name="user"]').type("import-test");
		cy.get('input[name="password"]').type("import-test-password");
		cy.get('[type="submit"]').click();
		cy.contains("#app-dashboard", "Recommended files").scrollIntoView().should("be.visible");

		// Navigate to tools page
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Tools").click();

		// Select file
		cy.get('select[name="delimiter"]').select(";");
		cy.get('input[type="file"]').selectFile("cypress/fixtures/test-data-semicolon.csv");
		cy.contains("button", "Generate preview from file").click();

		// Check counts in preview
		cy.contains("dt", "Clients").siblings("dd").contains(clients.length).scrollIntoView().should("be.visible");
		cy.contains("dt", "Projects").siblings("dd").contains(allProjects.length).scrollIntoView().should("be.visible");
		cy.contains("dt", "Tasks").siblings("dd").contains(allTasks.length).scrollIntoView().should("be.visible");
	});

	it("can create clients", () => {
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		for (const [index, client] of clients.entries()) {
			cy.contains(".list-title", "Clients");
			cy.contains("a", "Add client").click();
			cy.get('input[name="name"]').type(client.Name);
			cy.get('textarea[name="note"]').type("Some client note");
			cy.get(".oc-dialog form").submit();
			cy.contains(".list-title", "Clients");
			cy.contains("div.tm_item-row", client.Name).scrollIntoView().should("be.visible");
			cy.get("div.tm_item-row").should("have.length", index + 1);
		}
	});

	it("can edit client", () => {
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();

		const secondClient = clients[1];
		cy.contains("div.tm_item-row", secondClient.Name).click();
		cy.contains(".list-title", "Projects");

		waitForOcDialog();
		cy.contains("a", "Edit client").click();
		cy.contains(".oc-dialog", "Edit client").scrollIntoView().should("be.visible");
		cy.get('input[name="name"]').type(" (changed)");
		cy.get('textarea[name="note"]').type(" (note updated)");
		cy.contains("button", "Edit client").click();

		waitForPjax();
		cy.contains("span.tm_label", "Client")
			.parent()
			.contains(`${secondClient.Name} (changed)`)
			.scrollIntoView()
			.should("be.visible");
		cy.contains("span.tm_label", "Note")
			.parent()
			.contains("Some client note (note updated)")
			.scrollIntoView()
			.should("be.visible");

		cy.get("a").contains("Clients").click();
		cy.contains(".list-title", "Clients");
		cy.get("div.tm_item-row").should("have.length", clients.length);
		cy.contains("div.tm_item-row", `${secondClient.Name} (changed)`).scrollIntoView().should("be.visible");
	});

	it("can share clients", () => {
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		const firstClient = clients[0];
		cy.contains("div.tm_item-row", firstClient.Name).click();
		cy.contains(".list-title", "Projects");

		for (const username of testusers.slice(1)) {
			waitForOcDialog();
			cy.contains("button", "Share client").click();
			cy.contains(".oc-dialog", "Share with").scrollIntoView().should("be.visible");
			cy.get("input#sharee-select").type(username);
			cy.get("label.sharees .item.first").click();
			cy.contains("button", "Add").click();
			cy.contains("span.tm_label", "Shared with").parent().contains(username).scrollIntoView().should("be.visible");
		}

		cy.get("a").contains("Clients").click();
		const thirdClient = clients[2];
		cy.contains("div.tm_item-row", thirdClient.Name).click();
		cy.contains(".list-title", "Projects");

		for (const username of testusers.slice(1)) {
			waitForOcDialog();
			cy.contains("button", "Share client").click();
			cy.contains(".oc-dialog", "Share with").scrollIntoView().should("be.visible");
			cy.get("input#sharee-select").type(username);
			cy.get("label.sharees .item.first").click();
			cy.contains("button", "Add").click();
			cy.contains("span.tm_label", "Shared with").parent().contains(username).scrollIntoView().should("be.visible");
		}
	});

	it("can delete client", () => {
		const firstClient = clients[0];

		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		cy.contains(".list-title", "Clients");

		cy.contains("div.tm_item-row", firstClient.Name).click();
		cy.contains(".list-title", "Projects");
		waitForOcDialog();
		cy.contains("button", "Delete client").click();
		cy.contains("button", "Delete").click();
		cy.get("div.tm_item-row").should("have.length", clients.length - 1);
	});

	it("can create projects on clients", () => {
		cy.visit("/apps/timemanager");
		for (const client of clients.filter(({}, index) => index !== 0)) {
			cy.get("a").contains("Clients").click();
			cy.contains(".list-title", "Clients");
			cy.contains("div.tm_item-row", client.Name).click();

			for (const [index, project] of projects.filter((project) => project.Client === client.Name).entries()) {
				cy.contains(".list-title", "Projects");
				waitForOcDialog();
				cy.contains("a", "Add project").click();
				cy.get('input[name="name"]').type(project.Name);
				cy.get(".oc-dialog form").submit();
				waitForPjax();
				cy.contains("div.tm_item-row", project.Name).scrollIntoView().should("be.visible");
				cy.get("div.tm_item-row").should("have.length", index + 1);
			}
		}
	});

	it("can edit project on a client", () => {
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		cy.contains(".list-title", "Clients");

		const secondClient = clients[1];
		cy.contains("div.tm_item-row", secondClient.Name).click();
		cy.contains(".list-title", "Projects");

		const thirdProject = projects.filter((project) => project.Client === secondClient.Name)[2];
		cy.contains("div.tm_item-row", thirdProject.Name).click();
		cy.contains(".list-title", "Tasks");

		waitForOcDialog();
		cy.contains("a", "Edit project").click();
		cy.get('input[name="name"]').type(" (changed)");
		cy.contains("button", "Edit project").click();

		waitForPjax();
		cy.contains("span.tm_label", "Project")
			.parent()
			.contains(`${thirdProject.Name} (changed)`)
			.scrollIntoView()
			.should("be.visible");

		cy.get("a").contains(secondClient.Name).click();
		cy.get("div.tm_item-row").should(
			"have.length",
			projects.filter((project) => project.Client === secondClient.Name).length
		);
		cy.contains("div.tm_item-row", `${thirdProject.Name} (changed)`).scrollIntoView().should("be.visible");
	});

	it("can delete project on a client", () => {
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		const secondClient = clients[1];
		cy.contains("div.tm_item-row", secondClient.Name).click();
		cy.contains(".list-title", "Projects");

		const secondProject = projects.filter((project) => project.Client === secondClient.Name)[1];
		cy.contains("div.tm_item-row", secondProject.Name).click();
		cy.contains(".list-title", "Tasks");

		waitForOcDialog();
		cy.contains("button", "Delete project").click();
		cy.contains("button", "Delete").click();
		cy.get("div.tm_item-row").should(
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
			cy.contains(".list-title", "Clients");

			cy.contains("div.tm_item-row", client.Name).click();
			cy.contains(".list-title", "Projects");

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
				}
				cy.contains("div.tm_item-row", project.Name).click();
				cy.contains(".list-title", "Tasks");

				let numTasks = 0;
				for (const [taskIndex, task] of tasks
					.filter((task) => task.Project === project.Name)
					// .slice(0, 3)
					.entries()) {
					numTasks++;
					if (taskIndex > 0) {
						cy.get("a").contains(project.Name).click();
					}
					waitForOcDialog();
					cy.contains("a", "Add task").click();
					cy.get('input[name="name"]').type(task.Name);
					cy.get(".oc-dialog form").submit();
					waitForPjax();
					cy.contains("div.tm_item-row", task.Name).scrollIntoView().should("be.visible");
					cy.get("div.tm_item-row").should("have.length", numTasks);
				}
			}
		}
	});

	it("can edit task on a project", () => {
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		cy.contains(".list-title", "Clients");

		const secondClient = clients[1];
		cy.contains("div.tm_item-row", secondClient.Name).click();
		cy.contains(".list-title", "Projects");

		const fifthProject = projects.filter((project) => project.Client === secondClient.Name)[4];
		cy.contains("div.tm_item-row", fifthProject.Name).click();
		cy.contains(".list-title", "Tasks");

		const thirdTask = tasks.filter((task) => task.Project === fifthProject.Name)[2];
		cy.contains("div.tm_item-row", thirdTask.Name).click();
		cy.contains(".list-title", "Time entries");

		waitForOcDialog();
		cy.contains("a", "Edit task").click();
		cy.get('input[name="name"]').type(" (changed)");
		cy.contains("button", "Edit task").click();

		waitForPjax();
		cy.contains("span.tm_label", "Task")
			.parent()
			.contains(`${thirdTask.Name} (changed)`)
			.scrollIntoView()
			.should("be.visible");

		cy.get("a").contains(fifthProject.Name).click();
		cy.get("div.tm_item-row").should("have.length", tasks.filter((task) => task.Project === fifthProject.Name).length);
		cy.contains("div.tm_item-row", `${thirdTask.Name} (changed)`).scrollIntoView().should("be.visible");
	});

	it("can delete task on a project", () => {
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		cy.contains(".list-title", "Clients");

		const secondClient = clients[1];
		cy.contains("div.tm_item-row", secondClient.Name).click();
		cy.contains(".list-title", "Projects");

		const fifthProject = projects.filter((project) => project.Client === secondClient.Name)[4];
		cy.contains("div.tm_item-row", fifthProject.Name).click();
		cy.contains(".list-title", "Tasks");

		const thirdTask = tasks.filter((task) => task.Project === fifthProject.Name)[2];
		cy.contains("div.tm_item-row", thirdTask.Name).click();
		cy.contains(".list-title", "Time entries");

		waitForOcDialog();
		cy.contains("button", "Delete task").click();
		cy.contains("button", "Delete").click();
		cy.get("div.tm_item-row").should(
			"have.length",
			tasks.filter((task) => task.Project === fifthProject.Name).length - 1
		);
	});

	it("can create time entries", () => {
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		cy.contains(".list-title", "Clients");

		const secondClient = clients[1];
		cy.contains("div.tm_item-row", secondClient.Name).click();
		cy.contains(".list-title", "Projects");

		const firstProject = projects.filter((project) => project.Client === secondClient.Name)[0];
		cy.contains("div.tm_item-row", firstProject.Name).click();
		cy.contains(".list-title", "Tasks");

		const firstTask = tasks.filter((task) => task.Project === firstProject.Name)[0];
		cy.contains("div.tm_item-row", firstTask.Name).click();
		cy.contains(".list-title", "Time entries");

		for (const [index, timeEntry] of timeEntries.entries()) {
			waitForOcDialog();
			cy.contains("a", "Add time entry").click();
			cy.get('input[name="duration"]').type(timeEntry.time);
			cy.get('input[name="date"]').type(timeEntry.date);
			cy.get('textarea[name="note"]').type(timeEntry.note);
			cy.get(".oc-dialog form").submit();
			waitForPjax();
			cy.contains("div.tm_item-row", timeEntry.time.replace(",", ".")).scrollIntoView().should("be.visible");
			cy.contains("div.tm_item-row", timeEntry.note).scrollIntoView().should("be.visible");
			cy.contains("div.tm_item-row", timeEntry.formattedDate).scrollIntoView().should("be.visible");
			cy.get("div.tm_item-row").should("have.length", index + 1);
		}
	});

	it("can create time entries in shared client", () => {
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		cy.contains(".list-title", "Clients");

		const thirdClient = clients[2];
		cy.contains("div.tm_item-row", thirdClient.Name).click();
		cy.contains(".list-title", "Projects");

		const firstProject = projects.filter((project) => project.Client === thirdClient.Name)[0];
		cy.contains("div.tm_item-row", firstProject.Name).click();
		cy.contains(".list-title", "Tasks");

		const firstTask = tasks.filter((task) => task.Project === firstProject.Name)[0];
		cy.contains("div.tm_item-row", firstTask.Name).click();
		cy.contains(".list-title", "Time entries");

		for (const [index, timeEntry] of sharedTimeEntries.entries()) {
			waitForOcDialog();
			cy.contains("a", "Add time entry").click();
			cy.get('input[name="duration"]').type(timeEntry.time);
			cy.get('input[name="date"]').type(timeEntry.date);
			cy.get('textarea[name="note"]').type(timeEntry.note);
			cy.get(".oc-dialog form").submit();
			waitForPjax();
			cy.contains("div.tm_item-row", timeEntry.time.replace(",", ".")).scrollIntoView().should("be.visible");
			cy.contains("div.tm_item-row", timeEntry.note).scrollIntoView().should("be.visible");
			cy.contains("div.tm_item-row", timeEntry.formattedDate).scrollIntoView().should("be.visible");
			cy.get("div.tm_item-row").should("have.length", index + 1);
		}
	});

	it("can edit time entry", () => {
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		cy.contains(".list-title", "Clients");

		const secondClient = clients[1];
		cy.contains("div.tm_item-row", secondClient.Name).click();
		cy.contains(".list-title", "Projects");

		const firstProject = projects.filter((project) => project.Client === secondClient.Name)[0];
		cy.contains("div.tm_item-row", firstProject.Name).click();
		cy.contains(".list-title", "Tasks");

		const firstTask = tasks.filter((task) => task.Project === firstProject.Name)[0];
		cy.contains("div.tm_item-row", firstTask.Name).click();
		cy.contains(".list-title", "Time entries");

		waitForOcDialog();
		const secondTimeEntry = timeEntries[1];
		cy.contains("div.tm_item-row", secondTimeEntry.note)
			.contains("button", "Edit")
			// Button is only visible on hover, force needed
			.click({ force: true });
		cy.get('input[name="duration"]').clear().type("5.75");
		cy.get('input[name="date"]').clear().type("2021-03-26");
		cy.get('textarea[name="note"]').type(" (changed)");
		cy.get(".oc-dialog form").submit();

		waitForPjax();
		cy.contains("div.tm_item-row", `${secondTimeEntry.note} (changed)`).scrollIntoView().should("be.visible");
		cy.get("div.tm_item-row").should("have.length", timeEntries.length);
	});

	const markTimeEntry = (should: "exist" | "not.exist") => {
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		cy.contains(".list-title", "Clients");

		const secondClient = clients[1];
		cy.contains("div.tm_item-row", secondClient.Name).click();
		cy.contains(".list-title", "Projects");

		const firstProject = projects.filter((project) => project.Client === secondClient.Name)[0];
		cy.contains("div.tm_item-row", firstProject.Name).click();
		cy.contains(".list-title", "Tasks");

		const firstTask = tasks.filter((task) => task.Project === firstProject.Name)[0];
		cy.contains("div.tm_item-row", firstTask.Name).click();
		cy.contains(".list-title", "Time entries");

		const firstTimeEntry = timeEntries[0];
		cy.contains("div.tm_item-row", firstTimeEntry.note).within(() => {
			cy.get('input[type="checkbox"]').click({ force: true });
		});

		cy.contains("div.tm_item-row", firstTimeEntry.note).scrollIntoView().should("be.visible");
		cy.contains("div.tm_item-row", firstTimeEntry.note).within(() => {
			cy.get('input[type="checkbox"]:checked').should(should);
		});
		cy.get("div.tm_item-row").should("have.length", timeEntries.length);

		// See if status survives a page refresh
		cy.reload(true);

		cy.contains("div.tm_item-row", firstTimeEntry.note).scrollIntoView().should("be.visible");
		cy.contains("div.tm_item-row", firstTimeEntry.note).within(() => {
			cy.get('input[type="checkbox"]:checked').should(should);
		});
		cy.get("div.tm_item-row").should("have.length", timeEntries.length);
	};

	it("can mark time entry", () => {
		markTimeEntry("exist");
	});

	it("can unmark time entry", () => {
		markTimeEntry("not.exist");
	});

	it("can delete time entry", () => {
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		cy.contains(".list-title", "Clients");

		const secondClient = clients[1];
		cy.contains("div.tm_item-row", secondClient.Name).click();
		cy.contains(".list-title", "Projects");

		const firstProject = projects.filter((project) => project.Client === secondClient.Name)[0];
		cy.contains("div.tm_item-row", firstProject.Name).click();
		cy.contains(".list-title", "Tasks");

		const firstTask = tasks.filter((task) => task.Project === firstProject.Name)[0];
		cy.contains("div.tm_item-row", firstTask.Name).click();
		cy.contains(".list-title", "Time entries");

		waitForOcDialog();
		const secondTimeEntry = timeEntries[1];
		cy.contains("div.tm_item-row", secondTimeEntry.note)
			.contains("button", "Delete")
			// Button is only visible on hover, force needed
			.click({ force: true });
		cy.contains(".oc-dialog button", "Delete").click();

		waitForPjax();
		cy.contains("div.tm_item-row", `${secondTimeEntry.note} (changed)`).should("not.exist");
		cy.get("div.tm_item-row").should("have.length", timeEntries.length - 1);

		// Re-add time entry for next tests
		waitForOcDialog();
		cy.contains("a", "Add time entry").click();
		cy.get('input[name="duration"]').type(secondTimeEntry.time);
		cy.get('input[name="date"]').type(secondTimeEntry.date);
		cy.get('textarea[name="note"]').type(secondTimeEntry.note);
		cy.get(".oc-dialog form").submit();
		waitForPjax();
		cy.contains("div.tm_item-row", secondTimeEntry.time.replace(",", ".")).scrollIntoView().should("be.visible");
		cy.contains("div.tm_item-row", secondTimeEntry.note).scrollIntoView().should("be.visible");
		cy.contains("div.tm_item-row", secondTimeEntry.formattedDate).scrollIntoView().should("be.visible");
		cy.get("div.tm_item-row").should("have.length", timeEntries.length);
	});

	it("can display correct totals", () => {
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		cy.contains(".list-title", "Clients");

		const clientWithEntriesIndex = 1;
		const sharedClientIndex = 2;
		const secondClient = clients[clientWithEntriesIndex];

		for (const [clientIndex, client] of clients.entries()) {
			let numProjects = projects.filter((p) => p.Client === client.Name).length;
			if (clientIndex === 1) {
				// One project got deleted from this client
				numProjects -= 1;
			}
			if (clientIndex === 0) {
				// Client got deleted earlier, skip
				continue;
			}
			cy.contains(".tm_item-row", client.Name).within(() => {
				cy.contains(`${numProjects} projects`);
				cy.contains(`since ${new Date().getFullYear()}`);
				if (clientIndex === clientWithEntriesIndex) {
					cy.contains(timeEntriesTotalFormatted);
				} else if (clientIndex === sharedClientIndex) {
					cy.contains(sharedTimeEntriesFormatted);
				} else {
					cy.contains("0 hrs.");
				}
			});
		}

		cy.contains(".tm_item-row", secondClient.Name).click();
		cy.contains(".tm_object-details a", secondClient.Name);

		const projectWithEntriesIndex = 0;
		const firstProject = projects.filter((project) => project.Client === secondClient.Name)[projectWithEntriesIndex];

		for (const [projectIndex, project] of projects.filter((p) => p.Client === secondClient.Name).entries()) {
			let numTasks = tasks.filter((t) => t.Project === project.Name).length;
			if (projectIndex === 4) {
				// One task got deleted from this project
				numTasks -= 1;
			}
			if (projectIndex === 1) {
				// Project got deleted earlier, skip
				continue;
			}
			cy.contains(".tm_item-row", project.Name).within(() => {
				cy.contains(`${numTasks} tasks`);
				if (projectIndex === projectWithEntriesIndex) {
					cy.contains(timeEntriesTotalFormatted);
				} else {
					cy.contains("0 hrs.");
				}
			});
		}

		cy.contains("Client total")
			.parent()
			.within(() => {
				cy.contains(timeEntriesTotalFormatted);
			});

		cy.contains(".tm_item-row", firstProject.Name).click();
		cy.contains(".tm_object-details a", firstProject.Name);

		cy.contains("Project total")
			.parent()
			.within(() => {
				cy.contains(timeEntriesTotalFormatted);
			});
		cy.contains(".tm_summary", "Client")
			.parent()
			.within(() => {
				cy.contains(timeEntriesTotalFormatted);
			});

		const taskWithEntriesIndex = 0;
		const firstTask = tasks.filter((task) => task.Project === firstProject.Name)[taskWithEntriesIndex];

		for (const [taskIndex, task] of tasks.filter((t) => t.Project === firstProject.Name).entries()) {
			cy.contains(".tm_item-row", task.Name).within(() => {
				if (taskIndex === taskWithEntriesIndex) {
					cy.contains(timeEntriesTotalFormatted);
				} else {
					cy.contains("0 hrs.");
				}
			});
		}

		cy.contains(".tm_item-row", firstTask.Name).click();
		cy.contains(".tm_object-details a", firstTask.Name);

		cy.contains("Task total")
			.parent()
			.within(() => {
				cy.contains(timeEntriesTotalFormatted);
			});
		cy.contains(".tm_summary", "Project")
			.parent()
			.within(() => {
				cy.contains(timeEntriesTotalFormatted);
			});
		cy.contains(".tm_summary", "Client")
			.parent()
			.within(() => {
				cy.contains(timeEntriesTotalFormatted);
			});
	});

	it("can see clients, projects, tasks shared with me", () => {
		const sharedClient = clients[2];
		// Log out admin user
		cy.get("div#settings div#expand").click({ timeout: 4000 });
		cy.get('[data-id="logout"] > a').click({ timeout: 4000 });
		cy.reload(true);

		// Log in as sharee test user
		cy.get('input[name="user"]').type(testusers[1]);
		cy.get('input[name="password"]').type(`${testusers[1]}-password`);
		cy.get('[type="submit"]').click();
		cy.contains("#app-dashboard", "Recommended files").scrollIntoView().should("be.visible");

		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		cy.contains(".list-title", "Clients");

		cy.get(".tm_item-row").should("have.length", 1);
		cy.contains(".tm_item-row", sharedClient.Name);

		cy.contains(".tm_item-row", sharedClient.Name).click();
		cy.contains(".tm_object-details a", sharedClient.Name);

		for (const [projectIndex, project] of projects.filter((p) => p.Client === sharedClient.Name).entries()) {
			let numTasks = tasks.filter((t) => t.Project === project.Name).length;
			if (projectIndex === 1) {
				// Project got deleted earlier, skip
				continue;
			}
			cy.contains(".tm_item-row", project.Name).within(() => {
				cy.contains(`${numTasks} tasks`);
			});
			cy.contains(".tm_item-row", project.Name).click();
			cy.contains(".tm_object-details a", project.Name);

			for (const task of tasks.filter((t) => t.Project === project.Name)) {
				cy.contains(".tm_item-row", task.Name).within(() => {
					cy.contains("0 hrs.");
				});
			}

			cy.contains(".tm_object-details a", sharedClient.Name).click();
			cy.contains(".list-title", "Projects");
		}
	});

	it("can create time entries in a shared client (as a sharee)", () => {
		const sharedClient = clients[2];
		const testuser = testusers[1];
		// Log out admin user
		cy.get("div#settings div#expand").click({ timeout: 4000 });
		cy.get('[data-id="logout"] > a').click({ timeout: 4000 });
		cy.reload(true);

		// Log in as sharee test user
		cy.get('input[name="user"]').type(testuser);
		cy.get('input[name="password"]').type(`${testuser}-password`);
		cy.get('[type="submit"]').click();
		cy.contains("#app-dashboard", "Recommended files").scrollIntoView().should("be.visible");

		cy.visit("/apps/timemanager");
		cy.contains("No activity, yet. Check back later.");

		cy.get("a").contains("Clients").click();
		cy.contains(".list-title", "Clients");

		cy.contains("div.tm_item-row", sharedClient.Name).click();
		cy.contains(".list-title", "Projects");

		const firstProject = projects.filter((project) => project.Client === sharedClient.Name)[0];
		cy.contains("div.tm_item-row", firstProject.Name).click();
		cy.contains(".list-title", "Tasks");

		const firstTask = tasks.filter((task) => task.Project === firstProject.Name)[0];
		cy.contains("div.tm_item-row", firstTask.Name).click();
		cy.contains(".list-title", "Time entries");

		for (const [index, timeEntry] of sharedTimeEntries.entries()) {
			waitForOcDialog();
			cy.contains("a", "Add time entry").click();
			cy.get('input[name="duration"]').type(timeEntry.time);
			cy.get('input[name="date"]').type(timeEntry.date);
			cy.get('textarea[name="note"]').type(`[Sharee entry]: ${timeEntry.note}`);
			cy.get(".oc-dialog form").submit();
			waitForPjax();
			cy.contains("div.tm_item-row", timeEntry.time.replace(",", ".")).scrollIntoView().should("be.visible");
			cy.contains("div.tm_item-row", `[Sharee entry]: ${timeEntry.note}`).scrollIntoView().should("be.visible");
			cy.contains("div.tm_item-row", timeEntry.formattedDate).scrollIntoView().should("be.visible");
			cy.get("div.tm_item-row").should("have.length", index + 1);
		}

		cy.visit("/apps/timemanager");
		// Latest entries contains latest time entry (first one has latest date)
		cy.contains(".tm_item-row", `[Sharee entry]: ${sharedTimeEntries[0].note}`);
	});

	const inspectSharedTimeEntries = () => {
		const sharedClient = clients[2];

		cy.visit("/apps/timemanager");
		// Latest time entries _is_ supposed to contain sharee's entries
		cy.contains(".tm_item-row", "[Sharee entry]:");

		cy.get("a").contains("Clients").click();
		cy.contains(".list-title", "Clients");

		cy.contains("div.tm_item-row", sharedClient.Name).click();
		cy.contains(".list-title", "Projects");

		const firstProject = projects.filter((project) => project.Client === sharedClient.Name)[0];
		cy.contains("div.tm_item-row", firstProject.Name).click();
		cy.contains(".list-title", "Tasks");

		const firstTask = tasks.filter((task) => task.Project === firstProject.Name)[0];
		cy.contains("div.tm_item-row", firstTask.Name).click();
		cy.contains(".list-title", "Time entries");

		cy.get("div.tm_item-row").should("have.length", timeEntries.length * 2);
		for (const timeEntry of sharedTimeEntries) {
			cy.contains("div.tm_item-row", timeEntry.time.replace(",", ".")).scrollIntoView().should("be.visible");
			cy.contains("div.tm_item-row", timeEntry.note).scrollIntoView().should("be.visible");
			cy.contains("div.tm_item-row", `[Sharee entry]: ${timeEntry.note}`).scrollIntoView().should("be.visible");
			cy.contains("div.tm_item-row", timeEntry.formattedDate).scrollIntoView().should("be.visible");
		}
	};

	it("can see all time entries in shared clients (as a sharer)", () => {
		inspectSharedTimeEntries();
	});

	it("cannot see other's time entries in shared clients (as a sharee)", () => {
		const sharedClient = clients[2];
		const testuser = testusers[2];
		// Log out admin user
		cy.get("div#settings div#expand").click({ timeout: 4000 });
		cy.get('[data-id="logout"] > a').click({ timeout: 4000 });
		cy.reload(true);

		// Log in as sharee test user
		cy.get('input[name="user"]').type(testuser);
		cy.get('input[name="password"]').type(`${testuser}-password`);
		cy.get('[type="submit"]').click();
		cy.contains("#app-dashboard", "Recommended files").scrollIntoView().should("be.visible");

		cy.visit("/apps/timemanager");
		cy.contains("No activity, yet. Check back later.");

		cy.get("a").contains("Clients").click();
		cy.contains(".list-title", "Clients");

		cy.get("div.tm_item-row").each(() => {
			cy.contains("0 hrs.");
		});

		cy.contains("div.tm_item-row", sharedClient.Name).click();
		cy.contains(".list-title", "Projects");

		cy.get("div.tm_item-row").each(() => {
			cy.contains("0 hrs.");
		});

		const firstProject = projects.filter((project) => project.Client === sharedClient.Name)[0];
		cy.contains("div.tm_item-row", firstProject.Name).click();
		cy.contains(".list-title", "Tasks");

		cy.get("div.tm_item-row").each(() => {
			cy.contains("0 hrs.");
		});

		const firstTask = tasks.filter((task) => task.Project === firstProject.Name)[0];
		cy.contains("div.tm_item-row", firstTask.Name).click();
		cy.contains(".list-title", "Time entries");

		cy.get("div.tm_item-row").should("have.length", 1);
		cy.contains(
			"div.tm_item-row",
			"You don't have any time entries, yet. Try adding one by clicking “Add time entry”."
		);
	});

	it("cannot edit/delete clients, projects, tasks shared with me", () => {
		const sharedClient = clients[2];
		const testuser = testusers[1];
		// Log out admin user
		cy.get("div#settings div#expand").click({ timeout: 4000 });
		cy.get('[data-id="logout"] > a').click({ timeout: 4000 });
		cy.reload(true);

		// Log in as sharee test user
		cy.get('input[name="user"]').type(testuser);
		cy.get('input[name="password"]').type(`${testuser}-password`);
		cy.get('[type="submit"]').click();
		cy.contains("#app-dashboard", "Recommended files").scrollIntoView().should("be.visible");

		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		cy.contains(".list-title", "Clients");

		cy.contains("div.tm_item-row", sharedClient.Name).click();
		cy.contains(".list-title", "Projects");

		cy.contains("button", "Edit client").should("not.exist");

		const firstProject = projects.filter((project) => project.Client === sharedClient.Name)[0];
		cy.contains("div.tm_item-row", firstProject.Name).click();
		cy.contains(".list-title", "Tasks");

		cy.contains("button", "Edit project").should("not.exist");

		const firstTask = tasks.filter((task) => task.Project === firstProject.Name)[0];
		cy.contains("div.tm_item-row", firstTask.Name).click();
		cy.contains(".list-title", "Time entries");

		cy.contains("button", "Edit task").should("not.exist");
	});

	it("can list clients, projects, tasks shared with me", () => {
		const sharedClient = clients[2];
		const testuser = testusers[1];
		// Log out admin user
		cy.get("div#settings div#expand").click({ timeout: 4000 });
		cy.get('[data-id="logout"] > a').click({ timeout: 4000 });
		cy.reload(true);

		// Log in as sharee test user
		cy.get('input[name="user"]').type(testuser);
		cy.get('input[name="password"]').type(`${testuser}-password`);
		cy.get('[type="submit"]').click();
		cy.contains("#app-dashboard", "Recommended files").scrollIntoView().should("be.visible");

		cy.visit("/apps/timemanager");
		cy.get("a").contains("Projects").click();
		cy.contains(".list-title", "Projects");
		cy.contains("div.tm_item-row", sharedClient.Name);

		cy.get("a").contains("Tasks").click();
		cy.contains(".list-title", "Tasks");
		const firstProject = projects.filter((project) => project.Client === sharedClient.Name)[0];
		cy.contains("div.tm_item-row", firstProject.Name);

		cy.get("a").contains("Time entries").click();
		cy.contains(".list-title", "Time entries");
		const firstTask = tasks.filter((task) => task.Project === firstProject.Name)[0];
		cy.contains("div.tm_item-row", firstTask.Name);
	});

	it("can filter latest time entries by author", () => {
		const testuser = testusers[1];

		cy.visit("/apps/timemanager");

		// Check that not all rows are by the author
		cy.get(".tm_item-row").should("have.length", 5);
		cy.get(".tm_item-row").filter(`:contains(${testuser})`).should("have.length", 1);

		// Set filter by sharee
		cy.contains("button", "Filter by person").click();
		cy.contains("label", "Created by").within(() => cy.get("input").eq(0).type(testuser).blur());
		cy.get("label.sharee-filter-label .item.first").click();

		// Check if all rows are by the author
		cy.get(".tm_item-row").should("have.length", 3);
		cy.get(".tm_item-row").filter(`:contains(${testuser})`).should("have.length", 3);
	});

	it("can get API response with created, updated, deleted items", () => {
		// Log out admin user
		cy.get("div#settings div#expand").click({ timeout: 4000 });
		cy.get('[data-id="logout"] > a').click({ timeout: 4000 });
		cy.reload(true);

		// Check API response for each user
		for (const [index, user] of [Cypress.env("NEXTCLOUD_ADMIN_USER"), ...testusers].entries()) {
			if (index > 0) {
				continue;
			}

			cy.log(`Response for user ${user}`);

			cy.request({
				method: "POST",
				url: "/index.php/apps/timemanager/api/updateObjects",
				auth: {
					user: user,
					pass:
						user === Cypress.env("NEXTCLOUD_ADMIN_USER") ? Cypress.env("NEXTCLOUD_ADMIN_PASSWORD") : `${user}-password`,
				},
				body: {
					data: {
						clients: {
							created: [],
							updated: [],
							deleted: [],
						},
						projects: {
							created: [],
							updated: [],
							deleted: [],
						},
						tasks: {
							created: [],
							updated: [],
							deleted: [],
						},
						times: {
							created: [],
							updated: [],
							deleted: [],
						},
					},
					lastCommit: "none",
				},
			}).then((response) => {
				const counts = {
					clients: {
						created: 0,
						updated: 0,
						deleted: 0,
					},
					projects: {
						created: 0,
						updated: 0,
						deleted: 0,
					},
					tasks: {
						created: 0,
						updated: 0,
						deleted: 0,
					},
					times: {
						created: 0,
						updated: 0,
						deleted: 0,
					},
				};

				if (user === Cypress.env("NEXTCLOUD_ADMIN_USER")) {
					const deletedClient = clients[0];
					const deletedProject = projects.filter((p) => p.Client === clients[1].Name)[1];
					const availableProjects = projects.filter(
						(p) => p.Client !== deletedClient.Name && p.Name !== deletedProject.Name
					);
					counts.clients.created = clients.length - 1;
					counts.clients.updated = 0;
					counts.clients.deleted = 1;
					counts.projects.created = projects.filter((p) => p.Client !== deletedClient.Name).length - 1;
					counts.projects.updated = 0;
					counts.projects.deleted = 1; // 1 project got deleted
					counts.tasks.created = tasks.filter((t) => availableProjects.find((p) => t.Project === p.Name)).length - 1;
					counts.tasks.updated = 0;
					counts.tasks.deleted = 1; // 1 task got deleted
					counts.times.created = timeEntries.length + sharedTimeEntries.length - 1;
					counts.times.updated = 1; // 1 time entry got checked (`updated` property changes then)
					counts.times.deleted = 1; // 1 time entry got deleted
				} else if (user === "import-test") {
					counts.clients.created = clients.length;
					counts.projects.created = allProjects.length;
					counts.tasks.created = allTasks.length;
				}

				expect(response.isOkStatusCode).to.be.true;
				expect(response.body).to.have.property("data");

				expect(response.body.data).to.have.property("clients");
				expect(response.body.data.clients).to.have.property("created");
				expect(response.body.data.clients.created.length).to.equal(counts.clients.created);
				expect(response.body.data.clients).to.have.property("updated");
				expect(response.body.data.clients.updated.length).to.equal(counts.clients.updated);
				expect(response.body.data.clients).to.have.property("deleted");
				expect(response.body.data.clients.deleted.length).to.equal(counts.clients.deleted);

				expect(response.body.data).to.have.property("projects");
				expect(response.body.data.projects).to.have.property("created");
				expect(response.body.data.projects.created.length).to.equal(counts.projects.created);
				expect(response.body.data.projects).to.have.property("updated");
				expect(response.body.data.projects.updated.length).to.equal(counts.projects.updated);
				expect(response.body.data.projects).to.have.property("deleted");
				expect(response.body.data.projects.deleted.length).to.equal(counts.projects.deleted);

				expect(response.body.data).to.have.property("tasks");
				expect(response.body.data.tasks).to.have.property("created");
				expect(response.body.data.tasks.created.length).to.equal(counts.tasks.created);
				expect(response.body.data.tasks).to.have.property("updated");
				expect(response.body.data.tasks.updated.length).to.equal(counts.tasks.updated);
				expect(response.body.data.tasks).to.have.property("deleted");
				expect(response.body.data.tasks.deleted.length).to.equal(counts.tasks.deleted);

				expect(response.body.data).to.have.property("times");
				expect(response.body.data.times).to.have.property("created");
				expect(response.body.data.times.created.length).to.equal(counts.times.created);
				expect(response.body.data.times).to.have.property("updated");
				expect(response.body.data.times.updated.length).to.equal(counts.times.updated);
				expect(response.body.data.times).to.have.property("deleted");
				expect(response.body.data.times.deleted.length).to.equal(counts.times.deleted);
			});
		}
	});

	it("can unshare a currently shared client from one user", () => {
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		cy.contains(".list-title", "Clients");

		const thirdClient = clients[2];
		cy.contains("div.tm_item-row", thirdClient.Name).click();
		cy.contains(".list-title", "Projects");

		// Remove user 1 from list of sharees
		const username = testusers[1];
		cy.contains("button", "Share client").click();
		cy.contains("Existing shares")
			.parent()
			.within(() => {
				cy.contains("li", username).within(() => {
					cy.contains("button", "Delete").click();
				});
			});
		cy.contains("span.tm_label", "Shared with").parent().contains(username).should("not.exist");
	});

	it("cannot access unshared clients or time entries (as a sharee)", () => {
		const sharedClient = clients[2];
		// Log out admin user
		cy.get("div#settings div#expand").click({ timeout: 4000 });
		cy.get('[data-id="logout"] > a').click({ timeout: 4000 });
		cy.reload(true);

		// Log in as sharee test user
		cy.get('input[name="user"]').type(testusers[1]);
		cy.get('input[name="password"]').type(`${testusers[1]}-password`);
		cy.get('[type="submit"]').click();
		cy.contains("#app-dashboard", "Recommended files").scrollIntoView().should("be.visible");

		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		cy.contains(".list-title", "Clients");

		cy.get("div.tm_item-row").should("have.length", 1);
		cy.contains("div.tm_item-row", "You don't have any clients, yet. Get started by clicking “Add client”.");
		cy.contains(".tm_item-row", sharedClient.Name).should("not.exist");

		cy.visit("/apps/timemanager");
		// Latest entries contains latest time entry (first one has latest date)
		cy.contains(".tm_item-row", `[Sharee entry]: ${sharedTimeEntries[0].note}`).should("not.exist");
	});

	it("can access time entries for previously shared client (as a sharer)", () => {
		inspectSharedTimeEntries();
	});

	it("can create time entries via Quick Add on the Dashboard", () => {
		cy.visit("/apps/timemanager");

		const secondClient = clients[1];
		const firstProject = projects.filter((project) => project.Client === secondClient.Name)[0];
		const firstTask = tasks.filter((task) => task.Project === firstProject.Name)[0];
		const timeEntry = timeEntries[0];

		cy.get('input[name="note"]').type(timeEntry.note);
		cy.get('[data-cy="quick-add-duration"]').click();

		// Wait for autofocus to settle, in this case
		waitForOcDialog();

		// Check that duration is correctly caculated from arbitrary times
		cy.get('input[name="startTime"]').type("12:13");
		cy.get('input[name="endTime"]').type("15:54");
		cy.get('input[name="duration"]')
			.invoke("val")
			.then((duration) => {
				expect(duration).to.equal("3.68"); // 221 minutes
			});

		cy.get('input[name="duration"]').clear().type(timeEntry.time);

		// Check that difference between start and end equals duration
		cy.get('input[name="startTime"]')
			.invoke("val")
			.then((startTime) => {
				cy.get('input[name="endTime"]')
					.invoke("val")
					.then((endTime) => {
						const start = parse(startTime.toString(), "HH:mm", new Date());
						const end = parse(endTime.toString(), "HH:mm", new Date());
						expect(`${differenceInMinutes(end, start) / 60}`).to.equal(timeEntry.time);
					});
			});

		cy.get("#task-selector-button-input").click();
		cy.get('[data-cy="quick-add-task-search"]').type(firstTask.Name.substring(0, firstTask.Name.length - 3));
		cy.contains("a", firstTask.Name).click();

		cy.get('form[data-cy="quick-add-form"').submit();
		waitForPjax();

		cy.contains("div.tm_item-row", timeEntry.time.replace(",", ".")).scrollIntoView().should("be.visible");
		cy.contains("div.tm_item-row", timeEntry.note).scrollIntoView().should("be.visible");
		// Find day in formatted date
		cy.contains("div.tm_item-row", format(new Date(), "EEEE")).scrollIntoView().should("be.visible");
	});
});
