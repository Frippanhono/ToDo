describe("App start", () => {
  it("shows the calendar title", () => {
    cy.visit("/");
    cy.contains("h1", "Calendar").should("be.visible");
  });
});

export {};
