/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe("Calendar view", () => {
  beforeEach(() => {
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });

    cy.findByTestId("email-input").type("test@gmail.com");
    cy.findByRole("button", { name: /login/i }).click();
  });

  it("shows the calendar title", () => {
    cy.findByTestId("calendar-title").should("be.visible");
  });

  it("displays the logged in user's email", () => {
    cy.contains("test@gmail.com").should("be.visible");
  });

  it("can add a new task", () => {
    cy.findByTestId("title-input").type("My Cypress Task");
    cy.findByTestId("date-input").clear();
    cy.findByTestId("date-input").type("2025-09-30");
    cy.findByRole("button", { name: /add/i }).click();
    cy.contains('[data-testid="fc-event"]', "My Cypress Task").should(
      "be.visible"
    );
  });

  it("shows all status options and can filter to Completed", () => {
    cy.get('[data-testid="fc-event"]').its("length").should("be.gte", 1);
    cy.findByTestId("status-filter").select("Completed");
    cy.get('[data-testid="fc-event"]').then($items => {
      expect($items.length).to.be.gte(1);
    });

    cy.contains('[data-testid="fc-event"]', "Send report").should("be.visible");
    cy.findByTestId("status-filter").select("All status");
    cy.get('[data-testid="fc-event"]').then($items => {
      expect($items.length).to.be.gte(1);
    });
  });

  it("can filter by category", () => {
    // skapa en uppgift i 'work'
    cy.findByTestId("title-input").type("Work-only task");
    cy.findByTestId("date-input").clear();
    cy.findByTestId("date-input").type("2025-09-30");
    cy.findByTestId("add-task-category-filter").select("work");
    cy.findByRole("button", { name: /add/i }).click();

    // filtrera till work och verifiera
    cy.findByTestId("category-filter").select("work");
    cy.contains('[data-testid="fc-event"]', "Work-only task").should(
      "be.visible"
    );

    // filtrera till home och verifiera att den inte syns
    cy.findByTestId("category-filter").select("home");
    cy.contains('[data-testid="fc-event"]', "Work-only task").should(
      "not.exist"
    );
  });

  it("renders both filter dropdowns with correct options", () => {
    cy.findByTestId("category-filter").should("exist");
    cy.findByTestId("status-filter").should("exist");

    cy.findByTestId("status-filter")
      .find("option")
      .then($opts => {
        const labels = [...$opts].map(o =>
          o.textContent?.trim()?.toLowerCase()
        );
        expect(labels).to.include.members(["all status", "todo", "completed"]);
      });

    cy.findByTestId("category-filter")
      .find("option")
      .then($opts => {
        const labels = [...$opts].map(o =>
          o.textContent?.trim()?.toLowerCase()
        );
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
