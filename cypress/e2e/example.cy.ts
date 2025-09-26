describe("App start", () => {
  it("shows the calendar title", () => {
    cy.visit("/");
    cy.get('[data-testid="calendar-title"]').should("be.visible");
  });
});

export {};
