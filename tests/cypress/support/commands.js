// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("login", (username, password, route = '/apps/dashboard/') => {
	cy.session(
		username,
		() => {
			cy.visit("/index.php/login");
			cy.get("input[name=\"user\"]").type(username);
			cy.get("input[name=\"password\"]").type(password, { log: false });
			cy.get("[type=\"submit\"]").click();
			cy.url().should("include", route);
		  cy.contains("#app-dashboard", "Recommended files").scrollIntoView().should("be.visible");
		},
		{
			validate(){
				cy.request(route).its('status').should('eq', 200);
				cy.getCookie("nc_session_id").should("exist");
				cy.visit(`/u/${username}`);
				cy.get('h2').should('contain', username);
			}
		}
	);
  // in case the session already existed but we are on a different route...
	cy.visit(route);
});
