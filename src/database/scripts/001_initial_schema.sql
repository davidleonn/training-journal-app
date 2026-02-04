-- =================================================================
-- TRAINING JOURNAL - INITIAL SCHEMA V1
-- =================================================================

-- -----------------------------------------------------------------
-- PHASE 1: CLEANUP (The "Nuke")
-- We use 'DROP TABLE IF EXISTS' to make this script re-runnable.
-- 'CASCADE' ensures we delete the table even if others link to it.
-- We drop in REVERSE order (Children first, then Parents).
-- -----------------------------------------------------------------
DROP TABLE IF EXISTS sets CASCADE;           -- Delete Grandchild
DROP TABLE IF EXISTS exercises_log CASCADE;  -- Delete Child
DROP TABLE IF EXISTS workouts CASCADE;       -- Delete Parent
DROP TABLE IF EXISTS runs CASCADE;           -- Delete Sibling
DROP TABLE IF EXISTS users CASCADE;          -- Delete Root

-- -----------------------------------------------------------------
-- PHASE 2: CONSTRUCTION (The Build)
-- We create tables in FORWARD order (Parents first).
-- -----------------------------------------------------------------

-- 1. USERS TABLE
-- The root of the database. Everyone needs a user_id.
CREATE TABLE users (
    -- UUID: We use 128-bit random IDs instead of numbers (1, 2, 3) for security.
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- UNIQUE: Prevents two users from signing up with the same email.
    email VARCHAR(255) UNIQUE NOT NULL,
    
    -- TIMESTAMPTZ: Stores the exact moment of creation with Time Zone info.
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Let's add a test user so we have someone to "Log in" as
INSERT INTO users (email) 
VALUES ('davidleon_06@hotmail.com')
ON CONFLICT (email) DO NOTHING;

-- 2. WORKOUTS TABLE (Strength Container)
-- Represents a single gym session (e.g., "Monday Chest Day").
CREATE TABLE workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- FOREIGN KEY: Links this workout to a User.
    -- ON DELETE CASCADE: If User is deleted, their workouts are deleted too.
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    name VARCHAR(100) NOT NULL,
    date TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RUNS TABLE (Endurance Container)
-- Represents a single running session.
CREATE TABLE runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- CHECK CONSTRAINT: Ensures 'run_type' is strictly one of these 3 values.
    run_type VARCHAR(20) NOT NULL CHECK (run_type IN ('Easy', 'INTERVAL', 'LONG')),
    
    -- DECIMAL(5,2): Allows numbers up to 999.99 (e.g., 10.55 km).
    distance DECIMAL(5,2) NOT NULL,
    
    -- INTERVAL: A special Postgres type for durations (e.g., '00:45:00').
    duration INTERVAL NOT NULL,
    date TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EXERCISES_LOG TABLE (Specific Movements)
-- Represents an exercise inside a workout (e.g., "Bench Press").
CREATE TABLE exercises_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Links to the Workouts table above.
    workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
    
    name VARCHAR(100) NOT NULL
    position INTEGER NOT NULL
);

-- 5. SETS TABLE (The Data)
-- Represents the actual weight lifted.
CREATE TABLE sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Links to the Exercises table above.
    exercise_id UUID NOT NULL REFERENCES exercises_log(id) ON DELETE CASCADE,
    set_number INTEGER NOT NULL
);

-- 6. REPS_LOG TABLE (New: Where the actual weight lives)
CREATE TABLE reps_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    set_id UUID NOT NULL REFERENCES sets(id) ON DELETE CASCADE,
    weight DECIMAL(5,2) NOT NULL,
    rep_number INTEGER NOT NULL -- e.g., Rep 1 was 100kg, Rep 2 was 90kg
);