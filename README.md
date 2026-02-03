# Training Journal

A professional-grade, full-stack application for tracking strength training, endurance, and nutrition. This project implements a **Vertical Slice Architecture** to simulate a real-world production environment.

---

## Project Overview

The **Training Journal** is a personal data platform designed to capture the nuances of physical progression. Unlike generic trackers, this app focuses on the intersection of three core pillars:

1. **Strength:** Tracking progressive overload, volume, and intensity.
2. **Endurance:** Logging pace, heart rate, and distance for running.
3. **Nutrition:** Managing caloric intake and macronutrient ratios.

## Tech Stack

### **Core Frameworks**

| Layer        | Technology                                                   | Details                                |
| :----------- | :----------------------------------------------------------- | :------------------------------------- |
| **Backend**  | `.NET 10`                                                    | Web API using C#                       |
| **Frontend** | `React 19 + TypeScript + Vite, styled with Tailwind CSS v4.` | Latest Stable with Vite                |
| **Database** | `PostgreSQL`                                                 | Relational storage for complex metrics |

### **Testing & Quality**

- **Unit Testing:** `xUnit` (Backend) & `Vitest` (Frontend)
- **Integration:** `Postman` + `Newman` for API automated testing.
- **E2E:** `Playwright` for full browser-based regression testing.

### **DevOps**

- **CI/CD:** `GitHub Actions` (Separate pipelines for Backend and Frontend).
- **Deployment:** Automated flow to production environment.

---

## Repository Structure (Mono-repo)

We utilize a mono-repo strategy to ensure atomic changes and simplified dependency management between the API and UI.

```text
├── .github/workflows   # CI Pipelines (Frontend & Backend)
├── docs/               # Architecture Decision Records (ADRs) & ERDs
├── src/
│   ├── backend/        # .NET API Source Code
│   ├── frontend/       # React Application (Vite/Vitest)
│   └── database/       # SQL Initialization Scripts
├── qa/
│   ├── postman/        # API Integration Tests
│   └── Playwright/     # E2E Test Suite (Playwright)
└── docker-compose.yml  # Container Orchestration
```

# Backend

## Quick Start (Docker)

The easiest way to run the entire system (**API + Database**) is via **Docker Compose**. This ensures you have the correct database schema and API version without manual setup.

## Prerequisites

- Docker Desktop installed

## Run the App

```bash
# Start API and Database
docker compose up --build
```

The API will be available at: http://localhost:5001 .

## Architecture & Patterns

### Backend Patterns

- **Vertical Slice Architecture:** Features are grouped by domain (User, Workout) rather than technical layer (Controller, Service).
- **Repository Pattern:** We use a generic `BaseRepository` with `Dapper` for high-performance data access, abstracting raw SQL queries.
- **Minimal APIs:** Utilizing .NET's lightweight endpoint syntax for reduced overhead.

### Database Strategy

- **Initialization:** The database is automatically seeded with tables via `src/database/scripts/001_initial_schema.sql` on the first Docker run.
- **Versioning:** All schema changes are tracked in the `scripts` folder.

## Local Development (Manual)

If you wish to run the API outside of Docker (e.g., for debugging in Visual Studio):

1. **Start the Database:**
   Ensure a PostgreSQL instance is running locally or via Docker:

```bash

docker compose up db -d
```

2. **Configure Credentials:**
   Update src/backend/TrainingJournal.API/appsettings.json with your database connection string.

3. **Run the API:**

```bash
dotnet run --project src/backend/TrainingJournal.API/TrainingJournal.API.csproj
```

## CI/CD Pipeline

This project uses **GitHub Actions** for Continuous Integration.

- **Trigger:** Pushes and Pull Requests to the `master` branch.
- **Workflow:**
  1. Spins up a temporary isolated Postgres container.
  2. Builds the .NET API Docker image.
  3. Executes **Postman/Newman** integration tests against the running container.
  4. Blocks the PR if any test fails (Green/Red gate).

# Frontend

The frontend is a modern Single Page Application (SPA) built with performance and developer experience in mind.

### Getting Started

**Prerequisites**: [Node.js (v22+)](https://nodejs.org/)

1. **Navigate to the directory**:

```bash
cd src/frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Start the development server:**

```bash
npm run dev

```

The UI will be available at http://localhost:5173.

### Architecture: Feature-First

We use a **Feature-First** architecture to ensure the project remains maintainable and scalable. Unlike traditional structures that group by technical type (e.g., all components in one folder), this approach groups code by its business domain.

#### Directory Breakdown:

- **`src/components/ui`**: Contains global "Atoms" (Buttons, Inputs, Modals). These are base UI elements that are completely agnostic of business logic and can be used anywhere in the app.
- **`src/features/`**: The heart of the application. Each folder (e.g., `features/auth`, `features/workouts`) is a self-contained module containing its own:
  - `components/`: UI specific only to that feature.
  - `hooks/`: Custom React hooks for feature logic.
  - `services/`: API call definitions related to the feature.
  - `types/`: TypeScript interfaces and types.
- **`src/api`**: Centralized **Axios** configuration, including base URLs and global interceptors for handling JWT tokens and error responses.
- **`src/utils`**: Global helper functions, such as the `cn` utility for clean Tailwind CSS class merging.

---

#### Why Feature-First?

1.  **Isolation**: Changes to the workout logic won't accidentally break the authentication flow.
2.  **Scalability**: Adding a new domain (like "Nutrition" or "Analytics") is as simple as adding a new folder to `src/features/`.
3.  **Easier Onboarding**: New developers can find all logic related to a specific feature in one dedicated place.

### Tech Stack

The frontend is built with a modern, high-performance stack optimized for type safety and developer velocity:

- **Framework**: [React 19](https://react.dev/) (Latest stable)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Testing**: [Vitest (Unit) & Playwright (E2E)](https://vitest.dev/) (https://playwright.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest) (React Query)
- **Form Management**: [React Hook Form](https://react-hook-form.com/)
- **Linting**: [ESLint 9+](https://eslint.org/) (Flat Config)
- **Formatting**: [Prettier](https://prettier.io/)

## Quality Assurance & Testing

This project employs a **"Shift Left" testing strategy** with a strict CI pipeline to ensure code quality before merging. The architecture is split into two distinct domains:

### Architecture

- **Frontend (`src/frontend`)**
  - Unit Tests
  - Linting
  - Type Checking

- **QA (`qa/Playwright`)**
  - End-to-End (E2E) tests isolated from the source code

---

## Continuous Integration (CI)

We use **GitHub Actions** to automatically verify every **push** and **pull request** to `master`.  
The Frontend CI pipeline runs the following checks in order:

1. **Linting**  
   Checks for code style and potential errors (ESLint).

2. **Formatting**  
   Ensures code style consistency (Prettier).

3. **Type Checking**  
   Strict TypeScript validation (`tsc`).

4. **Unit Tests**  
   Component logic verification (Vitest).

5. **E2E Tests**  
   Full browser simulation (Playwright).

> **Note:**  
> The CI uses a _working-directory strategy_ to handle the separate `package.json` files for the frontend and the QA suite.

## Running Tests Locally

Since the project uses two separate package configurations, tests must be run from their respective folders.

---

### 1. Unit Tests (Vitest)

Runs fast, headless tests for individual components.

````bash
cd src/frontend

npm run test        # Run once
npm run test:watch  # Run in watch mode

### End-to-End Tests (Playwright)

Runs full browser automation using the **Page Object Model (POM)**.
You do **not** need to start the dev server manually—Playwright handles this automatically via the `webServer` configuration.

```bash
cd qa/Playwright

# Install dependencies (first time only)
npm install
npx playwright install --with-deps

# Run all E2E tests (Headless - Fast)
npx playwright test

# Run with UI (Visual Mode - Best for debugging)
npx playwright test --ui

# Run specifically on Chromium / Firefox / WebKit
npx playwright test --project=chromium


### Available Scripts

From the `src/frontend` directory, you can run:

| Command            | Description                                    |
| :----------------- | :--------------------------------------------- |
| `npm run dev`      | Starts the Vite development server.            |
| `npm run build`    | Compiles the application for production.       |
| `npm run lint`     | Runs the ESLint check.                         |
| `npm run lint:fix` | Automatically fixes repairable linting issues. |
| `npm run format`   | Formats the entire codebase using Prettier.    |
````
