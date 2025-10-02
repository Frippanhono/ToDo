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

    // 2) Markera som completed via overlay
    cy.contains('[data-testid="fc-event"]', "Seed Task", {
      timeout: 8000,
    }).click();

    cy.findByTestId("task-overlay")
      .should("be.visible")
      .within(() => {
        cy.findByTestId("overlay-toggle").click();
        cy.findByTestId("overlay-close").click();
      });

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

  it("opens TaskOverlay on event click, can save new title and delete the task", () => {
    // 1) Skapa uppgift
    cy.findByTestId("title-input").type("Overlay Test");
    cy.findByTestId("date-input").clear();
    cy.findByTestId("date-input").type("2025-09-30");
    cy.findByRole("button", { name: /add/i }).click();

    // 2) Öppna overlay
    cy.contains('[data-testid="fc-event"]', "Overlay Test", {
      timeout: 8000,
    }).click();

    // 3) Overlay syns
    cy.findByTestId("task-overlay")
      .should("be.visible")
      .within(() => {
        // 4) Ändra titel och spara
        // eslint-disable-next-line cypress/unsafe-to-chain-command
        cy.findByTestId("overlay-title-input").clear().type("Overlay Edited");
        cy.findByTestId("overlay-save").click();
      });

    // 5) Verifiera ny titel finns
    cy.contains('[data-testid="fc-event"]', "Overlay Edited", {
      timeout: 8000,
    }).should("exist");

    // 6) Öppna igen och radera
    cy.contains('[data-testid="fc-event"]', "Overlay Edited").click();
    cy.findByTestId("task-overlay")
      .should("be.visible")
      .within(() => {
        cy.findByTestId("overlay-delete").click();
      });

    // 7) Eventet ska vara borta
    cy.contains('[data-testid="fc-event"]', "Overlay Edited").should(
      "not.exist"
    );
  });

  it("can change category in TaskOverlay", () => {
    // Seed
    cy.findByTestId("title-input").type("Cat change");
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.findByTestId("date-input").clear().type("2025-10-02");
    cy.findByRole("button", { name: /add/i }).click();

    // Öppna overlay
    cy.contains('[data-testid="fc-event"]', "Cat change", {
      timeout: 8000,
    }).click();

    cy.findByTestId("task-overlay")
      .should("be.visible")
      .within(() => {
        cy.findByTestId("overlay-category").select("home");
        cy.findByTestId("overlay-save").click();
      });

    // Verifiera via overlay-selectens value
    cy.contains('[data-testid="fc-event"]', "Cat change").click();
    cy.findByTestId("task-overlay")
      .should("be.visible")
      .within(() => {
        cy.findByTestId("overlay-category").should("have.value", "home");
        cy.findByTestId("overlay-close").click();
      });
  });

  it("can toggle completed in TaskOverlay", () => {
    // Seed
    cy.findByTestId("title-input").type("Complete me");
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.findByTestId("date-input").clear().type("2025-10-02");
    cy.findByRole("button", { name: /add/i }).click();

    // Öppna overlay och toggla Completed
    cy.contains('[data-testid="fc-event"]', "Complete me", {
      timeout: 8000,
    }).click();
    cy.findByTestId("task-overlay")
      .should("be.visible")
      .within(() => {
        cy.findByTestId("overlay-toggle").click();
        cy.findByTestId("overlay-close").click();
      });

    // Verifiera via statusfilter
    cy.findByTestId("status-filter").select("completed");
    cy.contains('[data-testid="fc-event"]', "Complete me").should("exist");
    cy.findByTestId("status-filter").select("todo");
    cy.contains('[data-testid="fc-event"]', "Complete me").should("not.exist");
  });

  it("can change time/date and toggle All Day in TaskOverlay", () => {
    // Seed
    cy.findByTestId("title-input").type("DateTime task");
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.findByTestId("date-input").clear().type("2025-10-02");
    cy.findByRole("button", { name: /add/i }).click();

    // 1) Öppna overlay, slå AV All Day, skriv tid, spara
    cy.contains('[data-testid="fc-event"]', "DateTime task", {
      timeout: 8000,
    }).click();
    cy.findByTestId("task-overlay")
      .should("be.visible")
      .within(() => {
        // Använd gärna vårt test-id för switchen (stabilare än role)
        cy.findByTestId("overlay-allday").click(); // allDay: true -> false
        cy.findByTestId("overlay-time").should("not.be.disabled");
        // eslint-disable-next-line cypress/unsafe-to-chain-command
        cy.findByTestId("overlay-time").clear().type("09:30");
        cy.findByTestId("overlay-save").click();
      });

    // 2) Öppna igen, slå PÅ All Day, tid ska bli disabled & tom, spara
    cy.contains('[data-testid="fc-event"]', "DateTime task").click();
    cy.findByTestId("task-overlay")
      .should("be.visible")
      .within(() => {
        cy.findByTestId("overlay-allday").click(); // allDay: false -> true
        cy.findByTestId("overlay-time")
          .should("be.disabled")
          .and("have.value", "");
        cy.findByTestId("overlay-save").click();
      });
  });
});

export {};
