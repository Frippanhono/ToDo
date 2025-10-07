describe("App start", () => {
  it("shows the login title", () => {
    cy.visit("/");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000); // Wait to see page loading

    cy.get('[data-testid="login-title"]').should("be.visible");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000); // Wait to observe the title
  });
});

export {};
