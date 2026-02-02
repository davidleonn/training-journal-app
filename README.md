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

| Layer        | Technology   | Details                                |
| :----------- | :----------- | :------------------------------------- |
| **Backend**  | `.NET 10`    | Web API using C#                       |
| **Frontend** | `React`      | Latest Stable with Vite                |
| **Database** | `PostgreSQL` | Relational storage for complex metrics |
| **Language** | `TypeScript` | Type safety across the frontend        |

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
├── .github/workflows   # CI Pipelines (Postman Integration Tests)
├── docs/               # Architecture Decision Records (ADRs) & ERDs
├── src/
│   ├── backend/        # .NET API Source Code
│   └── database/       # SQL Initialization Scripts
├── qa/
│   └── postman/        # Integration Testing Collections
└── docker-compose.yml  # Container Orchestration
```

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
