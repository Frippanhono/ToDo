describe("App start", () => {
  it("shows the calendar title", () => {
    cy.visit("/"); // går till root
    cy.get("[data-testid='title']").should("contain.text", "📅 Calendar");
  });
});

export {};
