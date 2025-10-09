# 📅 ToDo Calendar App

A modern task management application with calendar view, built with React, TypeScript, and Vite. Allows users to create, organize, and manage their tasks in a visual and intuitive way.

## 🌐 Live Demo

**[https://frippanhono.github.io/ToDo/](https://frippanhono.github.io/ToDo/)**

## ✨ Features

- **📅 Calendar View**: Complete task visualization in calendar format using FullCalendar
- **🔐 Simple Authentication**: Email-based login system
- **📝 Task Management**: Create, edit, complete, and delete tasks
- **🏷️ Categorization**: Organize tasks by categories with distinctive colors
- **🔍 Filters and Sorting**: Filter by category and status (completed/pending)
- **💾 Local Persistence**: Data storage in localStorage
- **📱 Responsive Design**: Interface adapted for mobile and desktop devices
- **🎨 Modern UI**: Attractive design with gradients and styled components

## 🛠️ Technologies Used

### Frontend

- **React 18** - User interface library
- **TypeScript** - Static typing for JavaScript
- **Vite** - Fast build tool
- **Styled Components** - CSS-in-JS for styling
- **FullCalendar** - Interactive calendar component
- **Lucide React** - Modern icons

### Testing

- **Jest** - Unit testing framework
- **React Testing Library** - React component testing
- **Cypress** - End-to-end testing

### Development

- **ESLint** - Linter for JavaScript/TypeScript
- **Prettier** - Code formatter
- **Husky** - Git hooks
- **Commitizen** - Conventional commits

## 🚀 Installation and Setup

### Prerequisites

- Node.js 20 or higher
- npm

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd todo
   ```

2. **Install dependencies**

   ```bash
   npm ci
   ```

3. **Run in development mode**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   - The application will be available at `http://localhost:5173`

## 📋 Available Scripts

### Development

```bash
npm run dev          # Development server
npm run build        # Production build
npm run serve        # Preview server (port 3000)
```

### Testing

```bash
npm test                    # Run unit tests
npm run test:unit:coverage  # Tests with coverage
npm run test:e2e           # End-to-end tests (interactive)
npm run test:e2e:ci        # End-to-end tests (headless)
```

### Code Quality

```bash
npm run lint        # Linting with ESLint
npm run format      # Formatting with Prettier
npm run typecheck   # TypeScript type checking
```

### Git

```bash
npm run commit      # Interactive commit with Commitizen
```

## 🏗️ Project Architecture

```
src/
├── components/          # React components
│   ├── AddTaskCard.tsx     # Form to add tasks
│   ├── CalendarView.tsx    # Main calendar view
│   ├── LoginCard.tsx       # Login component
│   ├── SortFilterBar.tsx   # Filters and sorting bar
│   ├── TaskOverlay.tsx     # Task editing modal
│   └── tests/              # Component tests
├── controllers/         # Business logic
│   └── taskController.ts   # Task controller
├── Model/              # Data models
│   ├── Task.js            # Task model
│   └── User.js            # User model
├── services/           # Services
│   └── localStorage.ts     # Local storage service
├── utils/              # Utilities
│   ├── auth.ts            # Authentication utilities
│   ├── authService.ts     # Authentication service
│   ├── categories.ts      # Categories configuration
│   ├── Tasklist.ts        # Task manipulation functions
│   └── toTaskAdapter.ts   # Data conversion adapters
├── Data/               # Static data
│   └── user_tasks.json     # Sample data
├── assets/             # Static resources
├── App.tsx             # Main component
└── main.tsx            # Entry point
```

## 🎯 Main Features

### Authentication

- Simple email-based login
- Session persistence in localStorage
- Logout with data cleanup

### Task Management

- **Create**: Form with title, date, time, category, and description
- **Edit**: Editing modal with all fields
- **Complete**: Toggle completed/pending status
- **Delete**: Confirmation and task deletion
- **Categorize**: Category assignment with colors

### Calendar View

- **Monthly View**: General month overview
- **Weekly View**: Detailed week view
- **Daily View**: Specific day view
- **Navigation**: Buttons to change dates
- **Events**: Task visualization as events

### Filters and Sorting

- **By Category**: Filter tasks by specific category
- **By Status**: Show completed, pending, or all tasks
- **Sorting**: By date (ascending/descending) or title

## 🎨 Available Categories

- **Personal** - Personal tasks (Blue)
- **Work** - Work tasks (Green)
- **Study** - Academic tasks (Orange)
- **Health** - Health-related tasks (Red)
- **Home** - Household tasks (Purple)
- **Other** - General category (Gray)

## 🧪 Testing

### Unit Tests (Jest + RTL)

- React component tests
- Utility function tests
- Controller tests
- Code coverage

### End-to-End Tests (Cypress)

- Complete user flow
- Task creation and management
- Calendar navigation
- Filters and searches

### Run Tests

```bash
# Unit tests
npm test

# Tests with coverage
npm run test:unit:coverage

# E2E tests (interactive)
npm run test:e2e

# E2E tests (CI)
npm run test:e2e:ci
```

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Production Preview

```bash
npm run serve
```

### GitHub Pages

The project is configured for automatic deployment to GitHub Pages through GitHub Actions.

**Live site**: [https://frippanhono.github.io/ToDo/](https://frippanhono.github.io/ToDo/)

---

**Thank you for using ToDo Calendar App!** 🎉

If you find any issues or have suggestions, feel free to create an issue in the repository.
