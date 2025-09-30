/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe("Login flow", () => {
    it("shows login page on start", () => {
        cy.visit("/");
        cy.get('[data-testid="login-title"]').should("be.visible");
    });

    it("logs in a valid user", () => {
        cy.visit("/");
        cy.get("input#email").type("test@gmail.com");
        cy.findByRole("button", { name: /login/i }).click();

        cy.get('[data-testid="calendar-title"]').should("be.visible");
        cy.contains("test@gmail.com");
    });
});

export {};