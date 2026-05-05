# OwlCook — Data Model & Database Design

**Project:** OwlCook — AI Recipe Companion for College Students  
**Stack:** React 19 / Node.js + Express 5 / MariaDB (mysql2)  
**Assignment:** Lab 4 — Relational Database Design

---

## Table of Contents

1. [Tables & Attributes](#1-tables--attributes)
2. [Relationships](#2-relationships)
3. [ER Diagram](#3-er-diagram)
4. [Design Explanation](#4-design-explanation)
5. [AI Prompt Log](#5-ai-prompt-log)

---

## 1. Tables & Attributes

### `users`

Stores registered accounts. Each user can save multiple recipes.

| Column        | Type         | Constraints                   | Notes                          |
|---------------|--------------|-------------------------------|--------------------------------|
| `id`          | INT          | PRIMARY KEY, AUTO_INCREMENT   | Surrogate key                  |
| `email`       | VARCHAR(255) | UNIQUE, NOT NULL              | Used as login identifier       |
| `name`        | VARCHAR(255) | NOT NULL                      | Display name                   |
| `password_hash` | VARCHAR(255) | NOT NULL                   | bcrypt hash (cost factor 10)   |
| `created_at`  | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP     | Account creation time          |

---

### `foods`

Stores recipes saved by users. Each row belongs to exactly one user.  
Complex fields (`ingredients`, `steps`) are stored as JSON because their structure is flexible and not queried by individual element.

| Column        | Type         | Constraints                              | Notes                                        |
|---------------|--------------|------------------------------------------|----------------------------------------------|
| `id`          | INT          | PRIMARY KEY, AUTO_INCREMENT              | Surrogate key                                |
| `name`        | VARCHAR(255) | —                                        | Recipe name                                  |
| `description` | TEXT         | —                                        | Short description                            |
| `time`        | VARCHAR(100) | —                                        | Cooking time, e.g. "25 min"                  |
| `cost`        | VARCHAR(100) | —                                        | Budget estimate, e.g. "$5"                   |
| `servings`    | VARCHAR(100) | —                                        | Serving count, e.g. "2 people"               |
| `difficulty`  | VARCHAR(100) | —                                        | Easy / Medium / Hard                         |
| `ingredients` | JSON         | —                                        | Array of `{ name, amount }` objects          |
| `steps`       | JSON         | —                                        | Ordered array of instruction strings         |
| `calories`    | VARCHAR(100) | —                                        | Nutritional info (flat columns for simplicity) |
| `protein`     | VARCHAR(100) | —                                        |                                              |
| `carbs`       | VARCHAR(100) | —                                        |                                              |
| `fat`         | VARCHAR(100) | —                                        |                                              |
| `user_id`     | INT          | NOT NULL, FK → `users(id)` ON DELETE CASCADE | Owner of the recipe                   |
| `created_at`  | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP                | Save time                                    |

---

### SQL Schema (DDL)

```sql
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  name          VARCHAR(255)        NOT NULL,
  password_hash VARCHAR(255)        NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS foods (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255),
  description TEXT,
  time        VARCHAR(100),
  cost        VARCHAR(100),
  servings    VARCHAR(100),
  difficulty  VARCHAR(100),
  ingredients JSON,
  steps       JSON,
  calories    VARCHAR(100),
  protein     VARCHAR(100),
  carbs       VARCHAR(100),
  fat         VARCHAR(100),
  user_id     INT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 2. Relationships

### One-to-Many: `users` → `foods`

- **One** user can have **many** saved recipes.
- **Each** recipe belongs to exactly **one** user.
- Implemented via `foods.user_id` (FK → `users.id`).
- `ON DELETE CASCADE`: deleting a user removes all their saved recipes.

```
users (1) ─────────────< foods (many)
  id  ◄──── user_id (FK)
```

### No many-to-many for MVP

A many-to-many `user_recipe` join table (for shared/public recipes) was considered but excluded for MVP.  
The app generates and saves personal recipes — there is no social-sharing feature in scope.

---

## 3. ER Diagram

```
┌─────────────────────────────┐         ┌──────────────────────────────────────┐
│           users             │         │               foods                  │
├─────────────────────────────┤         ├──────────────────────────────────────┤
│ PK  id            INT       │◄────────┤ FK  user_id       INT  NOT NULL      │
│     email         VARCHAR   │  1    * │ PK  id            INT                │
│     name          VARCHAR   │         │     name          VARCHAR            │
│     password_hash VARCHAR   │         │     description   TEXT               │
│     created_at    TIMESTAMP │         │     time          VARCHAR            │
└─────────────────────────────┘         │     cost          VARCHAR            │
                                        │     servings      VARCHAR            │
                                        │     difficulty    VARCHAR            │
                                        │     ingredients   JSON               │
                                        │     steps         JSON               │
                                        │     calories      VARCHAR            │
                                        │     protein       VARCHAR            │
                                        │     carbs         VARCHAR            │
                                        │     fat           VARCHAR            │
                                        │     created_at    TIMESTAMP          │
                                        └──────────────────────────────────────┘
```

> **Key:** PK = Primary Key, FK = Foreign Key, `*` = many side of relationship

---

## 4. Design Explanation

### Why these two tables?

OwlCook's MVP has two core needs: **authentication** (who is the user?) and **favorites** (what did they save?). Two tables map directly to these two concerns without any unnecessary indirection.

A third table was considered for recipe *categories* or *tags*, but since the app uses a single `difficulty` string field and the AI always generates one recipe at a time, tagging is out of scope for a 7-week project.

### How the schema supports each user story

| User Story | Table(s) | How it's covered |
|---|---|---|
| As a student, I want to **register** and **log in** securely | `users` | `email` (UNIQUE), `password_hash` (bcrypt), session stored server-side via `express-session` |
| As a student, I want to **generate** a recipe with AI | No DB needed | Stateless GPT-4 call in `/api/generator`; recipe is returned to frontend only |
| As a student, I want to **save** a generated recipe to my favorites | `foods` | `POST /api/food` inserts a row with `user_id` FK |
| As a student, I want to **view** my saved recipes | `foods` | `GET /api/food` queries `WHERE user_id = ?` |
| As a student, I want to **delete** a saved recipe | `foods` | `DELETE /api/food/:id` verifies ownership via `user_id`, then removes row |
| As a student, I want to **update** my name or password | `users` | `PUT /api/users` runs `UPDATE users SET …` |

### What was simplified for MVP

1. **Nutrition as flat columns** — `calories`, `protein`, `carbs`, `fat` are separate VARCHAR columns rather than a normalized `nutritions` child table. This is simpler to query and the data is always fetched together.
2. **Ingredients and steps as JSON** — These are arrays that are always read/written as a whole; splitting them into rows (e.g. `ingredients(food_id, name, amount)`) would complicate inserts and reads with no query benefit for MVP.
3. **No `categories` / `tags` table** — Difficulty is a plain string. Advanced filtering is post-MVP.
4. **No social / sharing** — No `recipe_likes`, `follows`, or public recipe feed tables. OwlCook is personal-first.
5. **In-memory session store** — `express-session` defaults are used; a Redis or DB-backed store would be needed for multi-instance production deployment, but is out of scope.

### Trade-offs made

| Decision | Alternative | Reason for choice |
|---|---|---|
| JSON for `ingredients` / `steps` | Normalized child tables | Simpler code, always accessed together, no partial queries needed |
| Flat nutrition columns | `nutritions` child table (1-to-1) | 1-to-1 normalization adds a JOIN with zero query benefit |
| VARCHAR for time/cost/servings | INT/DECIMAL | GPT-4 returns strings like "25 min" or "$5–$8"; parsing adds complexity |
| Session cookie auth | JWT | Sessions are simpler to invalidate; no token refresh logic needed |

---

## 5. AI Prompt Log

### Prompt 1 — Entity Identification

**Prompt sent to AI:**
```
I am building OwlCook, an AI recipe web app for college students.
Core features: register/login, generate recipes with GPT-4 (budget, diet, cuisine inputs),
save recipes to favorites, view/delete favorites, update profile.

What are the core database entities for an MVP?
List only what is strictly necessary for a 7-week project.
```

**AI response (summary):** Suggested `users`, `recipes/foods`, and optionally `sessions`. Also mentioned tags, ratings, and ingredients tables.

**How I used it:** Confirmed my initial thinking of 2 tables. Discarded the suggestions for tags, ratings, and a separate ingredients table as they are not needed for MVP. The `sessions` table was also excluded since `express-session` handles this in memory by default.

---

### Prompt 2 — Initial Schema Generation

**Prompt sent to AI:**
```
Using my project's user stories and entities, design a relational database schema
for a React/Node/MariaDB application.

Project: OwlCook — save AI-generated recipes per user.
Entities: users, foods (saved recipes).

Please:
- define tables for MVP only
- list columns with data types
- include primary and foreign keys
- identify relationships
- avoid unnecessary complexity for a 7-week project
```

**AI response (summary):** Produced a schema very close to what I implemented — `users(id, email, name, password_hash, created_at)` and `foods(id, name, description, …, user_id FK)`. It suggested storing nutritions in a separate `nutritions` table and ingredients in a separate `ingredients` table.

**How I used it:** Used the core column list as a starting point. Rejected the separate `nutritions` table (unnecessary JOIN for a 1-to-1 relationship) and the `ingredients` table (always read/written as a whole, JSON is simpler). Merged nutrition into flat columns on `foods` and kept ingredients as a JSON column.

---

### Prompt 3 — Schema Critique

**Prompt sent to AI:**
```
Critique this schema for OwlCook MVP:

users(id, email, name, password_hash, created_at)
foods(id, name, description, time, cost, servings, difficulty,
      ingredients JSON, steps JSON, calories, protein, carbs, fat,
      user_id FK, created_at)

Please:
- identify missing relationships
- flag redundant or over-engineered parts
- check all user stories are covered
- suggest simplifications
- flag anything too complex for 7 weeks
```

**AI response (summary):**
- Confirmed the schema covers all MVP user stories.
- Suggested adding a `status` field to `foods` (e.g., "saved", "archived") for future soft-delete — noted as a good idea.
- Warned that storing `time`, `cost`, and `servings` as VARCHAR is less query-friendly but acceptable for MVP.
- Noted that JSON columns are supported in MariaDB 10.2+ and are appropriate here.
- Suggested an index on `foods(user_id)` for performance.

**How I used it:** Added mental note about the `user_id` index (can add later with `ALTER TABLE foods ADD INDEX idx_user_id (user_id)`). Decided to keep `status` field out for now — the MVP has no archive feature. Kept VARCHAR for time/cost as the data comes from GPT-4 as strings.

---

### Reflection on AI Usage

AI was useful for rapidly validating the schema and surfacing trade-offs I might have missed (like the nutrition normalization option). However, I made deliberate decisions to override AI suggestions in two key areas:

1. **Rejecting the normalized `ingredients` table** — AI defaults toward "correct" normalization. For this app, ingredients are never queried individually; they are always fetched as part of the full recipe. JSON is pragmatically better here.
2. **Rejecting the `status` column for MVP** — AI often suggests future-proofing. Keeping the schema lean is more important for a 7-week project than preparing for features that may never be built.

> "Do not let AI design your database — use AI to improve YOUR design."
