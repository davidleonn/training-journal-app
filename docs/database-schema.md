# Database Schema Design (PostgreSQL)

## Tables

### 1. Users

| Column       | Type           | Description          |
| :----------- | :------------- | :------------------- |
| `id`         | `UUID`         | Primary Key (PK)     |
| `email`      | `VARCHAR(255)` | Unique login email   |
| `created_at` | `TIMESTAMP`    | Record creation date |

### 2. Workouts (Strength)

| Column    | Type           | Description               |
| :-------- | :------------- | :------------------------ |
| `id`      | `UUID`         | PK                        |
| `user_id` | `UUID`         | Foreign Key (FK) to Users |
| `name`    | `VARCHAR(100)` | e.g., "Upper Body A"      |
| `date`    | `TIMESTAMP`    | When the session happened |

### 3. Exercises_Log

| Column       | Type           | Description         |
| :----------- | :------------- | :------------------ |
| `id`         | `UUID`         | PK                  |
| `workout_id` | `UUID`         | FK to Workouts      |
| `name`       | `VARCHAR(100)` | e.g., "Bench Press" |

### 4. Sets

| Column        | Type      | Description           |
| :------------ | :-------- | :-------------------- |
| `id`          | `UUID`    | PK                    |
| `exercise_id` | `UUID`    | FK to Exercises_Log   |
| `weight`      | `DECIMAL` | Amount lifted         |
| `reps`        | `INTEGER` | Number of repetitions |

### 5. Runs (Endurance)

| Column     | Type          | Description                |
| :--------- | :------------ | :------------------------- |
| `id`       | `UUID`        | PK                         |
| `user_id`  | `UUID`        | FK to Users                |
| `run_type` | `VARCHAR(20)` | 'Easy', 'INTERVAL', 'LONG' |
| `distance` | `DECIMAL`     | In kilometers              |
| `duration` | `INTERVAL`    | Time spent running         |
| `date`     | `TIMESTAMP`   | When it happened           |
