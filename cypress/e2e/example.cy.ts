describe("App start", () => {
  it("shows the login title", () => {
    cy.visit("/");
    cy.get('[data-testid="login-title"]').should("be.visible");
  });
});

export {};
