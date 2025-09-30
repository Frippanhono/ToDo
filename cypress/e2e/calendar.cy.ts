/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe("Calendar view", () => {
  beforeEach(() => {
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });
    cy.get("input#email").type("test@gmail.com");
    cy.findByRole("button", { name: /login/i }).click();
  });

  it("shows the calendar title", () => {
    cy.get('[data-testid="calendar-title"]').should("be.visible");
  });

  it("displays the logged in user's email", () => {
    cy.contains("test@gmail.com").should("be.visible");
  });

  it("can add a new task", () => {
    cy.get("input#title").type("My Cypress Task");
    cy.get("input#date").clear().type("2025-09-30");
    cy.findByRole("button", { name: /add/i }).click();
    cy.contains(".fc-event-title", "My Cypress Task").should("be.visible");
  });

  it("shows all status options and can filter to Completed", () => {
    cy.get(".fc-event").should("have.length.at.least", 1);

    cy.findByRole("combobox", { name: /status filter/i }).select("Completed");
    cy.get(".fc-event").should("have.length", 1);
    cy.contains(".fc-event", "Send report").should("be.visible");
  });

  it("can filter by category", () => {
    cy.get("input#title").type("Work-only task");
    cy.get("input#date").clear().type("2025-09-30");
    cy.findByRole("combobox", { name: /category filter/i }).select("work");
    cy.findByRole("button", { name: /add/i }).click();

    cy.findByRole("combobox", { name: /category filter/i }).select("work");
    cy.contains(".fc-event", "Work-only task").should("be.visible");

    cy.findByRole("combobox", { name: /category filter/i }).select("home");
    cy.contains(".fc-event", "Work-only task").should("not.exist");
  });

  it("renders both filter dropdowns with correct options", () => {
   
    cy.findByRole("combobox", { name: /category filter/i }).should("exist");
    cy.findByRole("combobox", { name: /status filter/i }).should("exist");

    cy.findByRole("combobox", { name: /status filter/i })
      .find("option")
      .then($opts => {
        const labels = [...$opts].map(o => o.textContent?.trim()?.toLowerCase());
        expect(labels).to.include.members(["all status", "todo", "completed"]);
      });

    cy.findByRole("combobox", { name: /category filter/i })
      .find("option")
      .then($opts => {
        const labels = [...$opts].map(o => o.textContent?.trim()?.toLowerCase());
        expect(labels).to.include.members([
          "all categories",
          "work / studies",
          "home / household",
          "health / well-being",
          "family / relationships",      
          "personal development / interests", 
        ]);
      });
  });
});

export {};