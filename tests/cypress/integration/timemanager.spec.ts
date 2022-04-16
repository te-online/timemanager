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
		cy.contains("dt", "Projects").siblings("dd").contains(allProjects.length).should("be.visible");
		cy.contains("dt", "Tasks").siblings("dd").contains(allTasks.length).should("be.visible");
		cy.contains("button", "Import now").click();

		// Inspect rows of clients after import
		cy.get("a").contains("Clients").click();
		cy.get("div.tm_item-row", { timeout: 4000 }).should("have.length", clients.length);

		// Rows of projects
		const testClient = clients[0];
		cy.contains("div.tm_item-row", testClient.Name, { timeout: 4000 }).click();
		cy.get("div.tm_item-row", { timeout: 4000 }).should(
			"have.length",
			allProjects.filter((project) => project.Client === testClient.Name).length
		);

		// Rows of tasks
		const testProject = allProjects.filter((project) => project.Client === testClient.Name)[0];
		cy.contains("div.tm_item-row", testProject.Name, { timeout: 4000 }).click();
		cy.get("div.tm_item-row", { timeout: 4000 }).should(
			"have.length",
			allTasks.filter((task) => task.Project === testProject.Name).length
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
					cy.wait(1000);
					cy.get("a").contains(client.Name, { timeout: 4000 }).click();
				}
				cy.wait(1000);
				cy.contains("div.tm_item-row", project.Name, { timeout: 4000 }).click();

				let numTasks = 0;
				for (const [taskIndex, task] of tasks
					.filter((task) => task.Project === project.Name)
					// .slice(0, 3)
					.entries()) {
					numTasks++;
					if (taskIndex > 0) {
						cy.wait(1000);
						cy.get("a").contains(project.Name, { timeout: 4000 }).click();
					}
					cy.wait(1000);
					cy.contains("a", "Add task", { timeout: 4000 }).click();
					cy.get('input[name="name"]').type(task.Name);
					cy.get(".oc-dialog form").submit();
					cy.wait(1000);
					cy.contains("div.tm_item-row", task.Name, { timeout: 4000 }).should("be.visible");
					cy.get("div.tm_item-row", { timeout: 4000 }).should("have.length", numTasks);
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
		cy.contains("span.tm_label", "Task", { timeout: 4000 })
			.parent()
			.contains(`${thirdTask.Name} (changed)`, { timeout: 4000 })
			.should("be.visible");

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
		cy.contains(".list-title", "Clients", { timeout: 4000 });

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
			.contains("button", "Edit")
			// Button is only visible on hover, force needed
			.click({ force: true });
		cy.wait(1000);

		cy.get('input[name="duration"]').clear().type("5.75");
		cy.get('input[name="date"]').clear().type("2021-03-26");
		cy.get('textarea[name="note"]').type(" (changed)");
		cy.get(".oc-dialog form").submit();

		cy.wait(1000);
		cy.contains("div.tm_item-row", `${secondTimeEntry.note} (changed)`).should("be.visible");
		cy.get("div.tm_item-row", { timeout: 4000 }).should("have.length", timeEntries.length);
	});

	const markTimeEntry = (should: "exist" | "not.exist") => {
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		cy.contains(".list-title", "Clients", { timeout: 4000 });

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
		cy.contains("div.tm_item-row", firstTimeEntry.note, { timeout: 4000 }).within(() => {
			cy.get('input[type="checkbox"]', { timeout: 4000 }).click({ force: true });
		});

		cy.wait(1000);
		cy.contains("div.tm_item-row", firstTimeEntry.note).should("be.visible");
		cy.contains("div.tm_item-row", firstTimeEntry.note).within(() => {
			cy.get('input[type="checkbox"]:checked').should(should);
		});
		cy.get("div.tm_item-row", { timeout: 4000 }).should("have.length", timeEntries.length);

		// See if status survives a page refresh
		cy.reload(true);

		cy.contains("div.tm_item-row", firstTimeEntry.note).should("be.visible");
		cy.contains("div.tm_item-row", firstTimeEntry.note).within(() => {
			cy.get('input[type="checkbox"]:checked').should(should);
		});
		cy.get("div.tm_item-row", { timeout: 4000 }).should("have.length", timeEntries.length);
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
		cy.contains(".list-title", "Clients", { timeout: 4000 });

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
			.contains("button", "Delete")
			// Button is only visible on hover, force needed
			.click({ force: true });
		cy.contains(".oc-dialog button", "Delete", { timeout: 4000 }).click();
		cy.wait(1000);

		cy.wait(1000);
		cy.contains("div.tm_item-row", `${secondTimeEntry.note} (changed)`).should("not.exist");
		cy.get("div.tm_item-row", { timeout: 4000 }).should("have.length", timeEntries.length - 1);

		// Re-add time entry for next tests
		cy.wait(1000);
		cy.contains("a", "Add time entry", { timeout: 4000 }).click();
		cy.get('input[name="duration"]').type(secondTimeEntry.time);
		cy.get('input[name="date"]').type(secondTimeEntry.date);
		cy.get('textarea[name="note"]').type(secondTimeEntry.note);
		cy.get(".oc-dialog form").submit();
		cy.wait(1000);
		cy.contains("div.tm_item-row", secondTimeEntry.time.replace(",", "."), { timeout: 4000 }).should("be.visible");
		cy.contains("div.tm_item-row", secondTimeEntry.note, { timeout: 4000 }).should("be.visible");
		cy.contains("div.tm_item-row", secondTimeEntry.formattedDate, { timeout: 4000 }).should("be.visible");
		cy.get("div.tm_item-row", { timeout: 4000 }).should("have.length", timeEntries.length);
	});

	it("can display correct totals", () => {
		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		cy.contains(".list-title", "Clients", { timeout: 4000 });

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

		cy.contains(".tm_item-row", secondClient.Name, { timeout: 4000 }).click();
		cy.contains(".tm_object-details a", secondClient.Name, { timeout: 4000 });

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

		cy.contains(".tm_item-row", firstProject.Name, { timeout: 4000 }).click();
		cy.contains(".tm_object-details a", firstProject.Name, { timeout: 4000 });

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

		cy.contains(".tm_item-row", firstTask.Name, { timeout: 4000 }).click();
		cy.contains(".tm_object-details a", firstTask.Name, { timeout: 4000 });

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
		cy.get('input[name="user"]', { timeout: 4000 }).type(testusers[1]);
		cy.get('input[name="password"]').type(`${testusers[1]}-password`);
		cy.get('input[type="submit"]').click();
		cy.wait(2000);

		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		cy.contains(".list-title", "Clients", { timeout: 4000 });

		cy.get(".tm_item-row").should("have.length", 1);
		cy.contains(".tm_item-row", sharedClient.Name);

		cy.contains(".tm_item-row", sharedClient.Name).click();
		cy.contains(".tm_object-details a", sharedClient.Name, { timeout: 4000 });

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
			cy.contains(".tm_object-details a", project.Name, { timeout: 4000 });

			for (const task of tasks.filter((t) => t.Project === project.Name)) {
				cy.contains(".tm_item-row", task.Name).within(() => {
					cy.contains("0 hrs.");
				});
			}

			cy.contains(".tm_object-details a", sharedClient.Name).click();
			cy.contains(".list-title", "Projects", { timeout: 4000 });
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
		cy.get('input[name="user"]', { timeout: 4000 }).type(testuser);
		cy.get('input[name="password"]').type(`${testuser}-password`);
		cy.get('input[type="submit"]').click();
		cy.wait(2000);

		cy.visit("/apps/timemanager");
		cy.contains("No activity, yet. Check back later.");

		cy.get("a").contains("Clients").click();
		cy.contains(".list-title", "Clients", { timeout: 4000 });

		cy.contains("div.tm_item-row", sharedClient.Name, { timeout: 4000 }).click();
		cy.contains(".list-title", "Projects", { timeout: 4000 });

		const firstProject = projects.filter((project) => project.Client === sharedClient.Name)[0];
		cy.contains("div.tm_item-row", firstProject.Name, { timeout: 4000 }).click();
		cy.contains(".list-title", "Tasks", { timeout: 4000 });

		const firstTask = tasks.filter((task) => task.Project === firstProject.Name)[0];
		cy.contains("div.tm_item-row", firstTask.Name, { timeout: 4000 }).click();
		cy.contains(".list-title", "Time entries", { timeout: 4000 });

		for (const [index, timeEntry] of sharedTimeEntries.entries()) {
			cy.wait(1000);
			cy.contains("a", "Add time entry", { timeout: 4000 }).click();
			cy.get('input[name="duration"]').type(timeEntry.time);
			cy.get('input[name="date"]').type(timeEntry.date);
			cy.get('textarea[name="note"]').type(`[Sharee entry]: ${timeEntry.note}`);
			cy.get(".oc-dialog form").submit();
			cy.wait(1000);
			cy.contains("div.tm_item-row", timeEntry.time.replace(",", "."), { timeout: 4000 }).should("be.visible");
			cy.contains("div.tm_item-row", `[Sharee entry]: ${timeEntry.note}`, { timeout: 4000 }).should("be.visible");
			cy.contains("div.tm_item-row", timeEntry.formattedDate, { timeout: 4000 }).should("be.visible");
			cy.get("div.tm_item-row", { timeout: 4000 }).should("have.length", index + 1);
		}

		cy.visit("/apps/timemanager");
		// Latest entries contains latest time entry (first one has latest date)
		cy.contains(".tm_item-row", `[Sharee entry]: ${sharedTimeEntries[0].note}`);
	});

	it("can see all time entries in shared clients (as a sharer)", () => {
		const sharedClient = clients[2];

		cy.visit("/apps/timemanager");
		// Latest time entries is not supposed to contain sharee's entries
		cy.contains(".tm_item-row", "[Sharee entry]:").should("not.exist");

		cy.get("a").contains("Clients").click();
		cy.contains(".list-title", "Clients", { timeout: 4000 });

		cy.contains("div.tm_item-row", sharedClient.Name, { timeout: 4000 }).click();
		cy.contains(".list-title", "Projects", { timeout: 4000 });

		const firstProject = projects.filter((project) => project.Client === sharedClient.Name)[0];
		cy.contains("div.tm_item-row", firstProject.Name, { timeout: 4000 }).click();
		cy.contains(".list-title", "Tasks", { timeout: 4000 });

		const firstTask = tasks.filter((task) => task.Project === firstProject.Name)[0];
		cy.contains("div.tm_item-row", firstTask.Name, { timeout: 4000 }).click();
		cy.contains(".list-title", "Time entries", { timeout: 4000 });

		cy.get("div.tm_item-row", { timeout: 4000 }).should("have.length", timeEntries.length * 2);
		for (const timeEntry of sharedTimeEntries) {
			cy.contains("div.tm_item-row", timeEntry.time.replace(",", "."), { timeout: 4000 }).should("be.visible");
			cy.contains("div.tm_item-row", timeEntry.note, { timeout: 4000 }).should("be.visible");
			cy.contains("div.tm_item-row", `[Sharee entry]: ${timeEntry.note}`, { timeout: 4000 }).should("be.visible");
			cy.contains("div.tm_item-row", timeEntry.formattedDate, { timeout: 4000 }).should("be.visible");
		}
	});

	it("cannot see other's time entries in shared clients (as a sharee)", () => {
		const sharedClient = clients[2];
		const testuser = testusers[2];
		// Log out admin user
		cy.get("div#settings div#expand").click({ timeout: 4000 });
		cy.get('[data-id="logout"] > a').click({ timeout: 4000 });
		cy.reload(true);

		// Log in as sharee test user
		cy.get('input[name="user"]', { timeout: 4000 }).type(testuser);
		cy.get('input[name="password"]').type(`${testuser}-password`);
		cy.get('input[type="submit"]').click();
		cy.wait(2000);

		cy.visit("/apps/timemanager");
		cy.contains("No activity, yet. Check back later.");

		cy.get("a").contains("Clients").click();
		cy.contains(".list-title", "Clients", { timeout: 4000 });

		cy.get("div.tm_item-row").each(() => {
			cy.contains("0 hrs.");
		});

		cy.contains("div.tm_item-row", sharedClient.Name, { timeout: 4000 }).click();
		cy.contains(".list-title", "Projects", { timeout: 4000 });

		cy.get("div.tm_item-row").each(() => {
			cy.contains("0 hrs.");
		});

		const firstProject = projects.filter((project) => project.Client === sharedClient.Name)[0];
		cy.contains("div.tm_item-row", firstProject.Name, { timeout: 4000 }).click();
		cy.contains(".list-title", "Tasks", { timeout: 4000 });

		cy.get("div.tm_item-row").each(() => {
			cy.contains("0 hrs.");
		});

		const firstTask = tasks.filter((task) => task.Project === firstProject.Name)[0];
		cy.contains("div.tm_item-row", firstTask.Name, { timeout: 4000 }).click();
		cy.contains(".list-title", "Time entries", { timeout: 4000 });

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
		cy.get('input[name="user"]', { timeout: 4000 }).type(testuser);
		cy.get('input[name="password"]').type(`${testuser}-password`);
		cy.get('input[type="submit"]').click();
		cy.wait(2000);

		cy.visit("/apps/timemanager");
		cy.get("a").contains("Clients").click();
		cy.contains(".list-title", "Clients", { timeout: 4000 });

		cy.contains("div.tm_item-row", sharedClient.Name, { timeout: 4000 }).click();
		cy.contains(".list-title", "Projects", { timeout: 4000 });

		cy.contains("button", "Edit client").should("not.exist");

		const firstProject = projects.filter((project) => project.Client === sharedClient.Name)[0];
		cy.contains("div.tm_item-row", firstProject.Name, { timeout: 4000 }).click();
		cy.contains(".list-title", "Tasks", { timeout: 4000 });

		cy.contains("button", "Edit project").should("not.exist");

		const firstTask = tasks.filter((task) => task.Project === firstProject.Name)[0];
		cy.contains("div.tm_item-row", firstTask.Name, { timeout: 4000 }).click();
		cy.contains(".list-title", "Time entries", { timeout: 4000 });

		cy.contains("button", "Edit task").should("not.exist");
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

	// it("cannot send created, updated, deleted items for shared clients", () => {});

	// it("cannot access unshared clients or time entries", () => {});

	// it("can access time entries for previously shared client", () => {});
});
