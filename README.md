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
/
├── .github/workflows/   # CI/CD YAML definitions (Build, Test, Deploy)
├── src/
│   ├── backend/         # .NET 10 Solution (Clean Architecture)
│   └── frontend/        # React + TS + Vite
├── docs/                # Architecture Decision Records (ADRs) & ERDs
└── qa/                 # Postman and Playwright test suites
```
