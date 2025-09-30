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
    cy.findByTestId("date-input").clear().type("2025-09-30");
    cy.findByRole("button", { name: /add/i }).click();

    // Leta bland kalenderns event (data-testid sätts i eventDidMount)
    cy.contains('[data-testid="fc-event"]', "My Cypress Task").should(
      "be.visible"
    );
  });

  it("shows all status options and can filter to Completed", () => {
    cy.get('[data-testid="fc-event"]').its("length").should("be.gte", 1);

    // Filtrera status via SortFilterBar (value = "completed")
    cy.findByTestId("status-filter").select("completed");
    cy.get('[data-testid="fc-event"]').its("length").should("be.gte", 1);
    cy.contains('[data-testid="fc-event"]', "Send report").should("be.visible");

    // Tillbaka till alla (value = "all")
    cy.findByTestId("status-filter").select("all");
    cy.get('[data-testid="fc-event"]').its("length").should("be.gte", 1);
  });

  it("can filter by category", () => {
    // Skapa en work-task via AddTaskCard (detta är formuläret)
    cy.findByTestId("title-input").type("Work-only task");
    cy.findByTestId("date-input").clear().type("2025-09-30");
    cy.findByTestId("add-task-category-filter").select("work");
    cy.findByRole("button", { name: /add/i }).click();

    // Filtrera via SortFilterBar (detta är filterraden)
    cy.findByTestId("category-filter").select("work");
    cy.contains('[data-testid="fc-event"]', "Work-only task").should(
      "be.visible"
    );

    cy.findByTestId("category-filter").select("home");
    cy.contains('[data-testid="fc-event"]', "Work-only task").should(
      "not.exist"
    );
  });

  it("renders both filter dropdowns with correct options", () => {
    cy.findByTestId("category-filter").should("exist");
    cy.findByTestId("status-filter").should("exist");

    // Status-alternativ: textetiketter (labels)
    cy.findByTestId("status-filter")
      .find("option")
      .then($opts => {
        const labels = [...$opts].map(o => o.textContent?.trim()?.toLowerCase());
        expect(labels).to.include.members(["all status", "todo", "completed"]);
      });

    // Kategori-alternativ: textetiketter (labels)
    cy.findByTestId("category-filter")
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