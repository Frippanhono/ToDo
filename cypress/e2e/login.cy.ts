/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe("Login flow", () => {
  beforeEach(() => {
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });
    cy.findByTestId("login-title").should("be.visible");
  });

  it("shows an error for invalid email format", () => {
    cy.findByTestId("email-input").type("not-an-email", { delay: 100 });
    cy.findByRole("button", { name: /login/i }).click();

    // authService.isValidEmail -> "Please enter a valid email address"
    cy.contains(/please enter a valid email address/i).should("be.visible");
  });

  it("shows an error for unknown user with valid email", () => {
    cy.findByTestId("email-input").type("unknown.user@example.com", {
      delay: 100,
    });
    cy.findByRole("button", { name: /login/i }).click();

    // authService.validateUser -> "User not found. Please check your email address."
    cy.contains(/user not found\. please check your email address\./i).should(
      "be.visible"
    );
  });

  it("allows login for a known user and persists after reload", () => {
    cy.findByTestId("email-input").type("test@gmail.com", { delay: 100 });
    cy.findByRole("button", { name: /login/i }).click();

    // Calendar page visible
    cy.findByTestId("calendar-title").should("be.visible");
    cy.contains("test@gmail.com").should("be.visible");

    // Persistence after reload
    cy.reload();
    cy.findByTestId("calendar-title").should("be.visible");
    cy.contains("test@gmail.com").should("be.visible");
  });
});

export {};
