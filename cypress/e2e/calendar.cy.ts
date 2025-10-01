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

    // Säkerställ att kalendern är renderad
    cy.findByTestId("calendar-title").should("be.visible");
  });

  it("shows the calendar title", () => {
    cy.findByTestId("calendar-title").should("be.visible");
  });

  it("displays the logged in user's email", () => {
    cy.findByTestId("calendar-title").should("be.visible");
    cy.contains("test@gmail.com").should("be.visible");
  });

  it("can add a new task", () => {
    cy.findByTestId("title-input").type("My Cypress Task");
    cy.findByTestId("date-input").clear();
    cy.findByTestId("date-input").type("2025-09-30");
    cy.findByRole("button", { name: /add/i }).click();

    // Ny kedja från cy — inga “scoped contains”
    cy.get('[data-testid="fc-event"]', { timeout: 8000 }).should(
      "contain.text",
      "My Cypress Task"
    );
  });

  it("shows all status options and can filter to Completed", () => {
    // 1) Skapa en uppgift
    cy.findByTestId("title-input").type("Seed Task");
    cy.findByTestId("date-input").clear();
    cy.findByTestId("date-input").type("2025-09-30");
    cy.findByRole("button", { name: /add/i }).click();

    // 2) Markera som completed via overlay så vi vet att det finns minst en “completed”
    cy.contains('[data-testid="fc-event"]', "Seed Task", {
      timeout: 8000,
    }).click();
    cy.findByTestId("task-overlay").should("be.visible");
    cy.findByTestId("overlay-toggle").click(); // toggle completed
    cy.findByTestId("overlay-close").click();

    // 3) Filtrera till completed
    cy.findByTestId("status-filter").select("completed");

    // 4) Det ska finnas minst ett event och minst ett som är Seed Task
    cy.get('[data-testid="fc-event"]', { timeout: 8000 })
      .its("length")
      .should("be.gte", 1);
    cy.contains('[data-testid="fc-event"]', "Seed Task").should("exist");

    // 5) Tillbaka till “all”
    cy.findByTestId("status-filter").select("all");
    cy.get('[data-testid="fc-event"]').its("length").should("be.gte", 1);
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
    cy.contains('[data-testid="fc-event"]', "Work-only task", {
      timeout: 8000,
    }).should("exist");

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
        const labels = Array.from($opts).map(o =>
          o.textContent?.trim()?.toLowerCase()
        );
        expect(labels).to.include.members(["all status", "todo", "completed"]);
      });

    cy.findByTestId("category-filter")
      .find("option")
      .then($opts => {
        const labels = Array.from($opts).map(o =>
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

  it("opens TaskOverlay on event click, can save new title and delete the task", () => {
    // 1) Skapa uppgift
    cy.findByTestId("title-input").type("Overlay Test");
    cy.findByTestId("date-input").clear();
    cy.findByTestId("date-input").type("2025-09-30");
    cy.findByRole("button", { name: /add/i }).click();

    // 2) Öppna overlay genom att klicka på eventets kort
    cy.contains('[data-testid="fc-event"]', "Overlay Test", {
      timeout: 8000,
    }).click();

    // 3) Overlay syns
    cy.findByTestId("task-overlay").should("be.visible");

    // 4) Ändra titel och spara
    cy.findByTestId("overlay-title-input").clear();
    cy.findByTestId("overlay-title-input").type("Overlay Edited");
    cy.findByTestId("overlay-save").click();

    // 5) Verifiera att eventet uppdaterats (ny titel finns)
    cy.contains('[data-testid="fc-event"]', "Overlay Edited", {
      timeout: 8000,
    }).should("exist");

    // 6) Öppna igen och radera
    cy.contains('[data-testid="fc-event"]', "Overlay Edited").click();
    cy.findByTestId("task-overlay").should("be.visible");
    cy.findByTestId("overlay-delete").click();

    // 7) Eventet ska vara borta
    cy.contains('[data-testid="fc-event"]', "Overlay Edited").should(
      "not.exist"
    );
  });
});

export {};
