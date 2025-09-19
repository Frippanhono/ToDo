# CONTRIBUTING.md

Den här guiden beskriver **hur vi arbetar**, hur vi **döper brancher**, hur vi **skriver commits**, hur vi **öppnar PRs**, samt hur vi **kör tester och CI** för projektet _ToDo_.

- Branch från `dev`, döp som `feat/...`, `fix/...` etc.
- Använd **Conventional Commits**.
- Skriv tester (Jest/RTL/Cypress) för nya/ändrade beteenden.
- PR: liten, länkad till Issue, gröna checks, en review.
- Flytta kort i **Projects (Kanban)** efter status.

## 1 Förutsättningar

- Node 20 och npm
- Git + GitHub-konto

## 2 Kom igång lokalt

```bash
# Klona
git clone <repo-url>
cd todo

# Installera
npm ci

# Kör dev-server
npm run dev

# Kör tester
npm test              # Jest/RTL
npm run cy:open       # Cypress UI
npm run cy:run        # Cypress headless
```

## 3 Kanban & backlog

Vi använder **GitHub Projects** som Kanban: `Backlog → Todo → In progress → In review → Done`.

- Definitioner:

  - DoR (Ready): AC finns, teststrategi nämns.
  - DoD (Done): AC uppfyllda, tester gröna lokalt & i CI, PR mergad till `dev`, Pages deploy klar, kort flyttat till **Done**.

## 4 Branch‑namn

- Feature: `feat/<kort-beskrivning>` → `feat/add-task-form`
- Fix: `fix/<bugg>` → `fix/date-parse`
- Refactor: `refactor/<område>` → `refactor/store-types`
- Chore/CI: `chore/<vad>` → `chore/gh-actions-pages`
- Hotfix: `hotfix/<vad>`

Regler:

- Branch alltid från **dev**.
- Håll PRs **små** och fokuserade.

## 5 Commit‑meddelanden (Conventional Commits)

Format:

```
type(scope): sammanfattning
```

**Typer**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `build`, `ci`, `chore`

**Exempel**

- `feat(add-task): stöd för etiketter vid skapande`
- `fix(calendar): vecka startar på måndag`
- `test(store): lägg till toggle‑test`

## 6 Tester

- Enhet: Jest (Zustand‑store, util‑funktioner)
- Komponent: React Testing Library (formulär, rendering, interaktion)
- E2E: Cypress (happy path: skapa → checka av → filtrera → kalender)

Kommandoöversikt:

```bash
npm test        # jest
npm run cy:open # cypress ui
npm run cy:run  # cypress headless
```

Skriv tester när:

- Nya features läggs till
- Beteenden ändras/regressionsrisk finns

## 7 Pull Requests

- Titel: gärna i commit‑stil, t.ex. `feat(add-task): etiketter vid skapande`
- Beskrivning: What/Why/How + skärmdump/GIF vid UI‑ändring
- Länka issue: `Closes #<nummer>`
- Checks måste vara gröna (Jest, build, ev. Cypress)
- Review: minst 1 godkännande, inga blockerande kommentarer
- När PR mergas flyttas kort till **Done**

## 8 Kodstil

- Projektet använder **TypeScript**.

## 9 CI/CD & Pages

- GitHub Actions kör: **test → build → deploy to Pages** på `dev`.
- Vite `base` är satt för repo‑namn så Pages fungerar.

## 10 Releases

- Tagga stabila milstolpar: `v0.1.0`, `v0.2.0`, ...
- Release‑notes: kort changelog + länk till Pages‑demo.

## 11 Frågor & support

- Skapa en **Discussion** eller **Issue** med label `question` om något är oklart.
