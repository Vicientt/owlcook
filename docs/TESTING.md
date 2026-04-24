# Testing & CI — OwlCook

## Quick start

```bash
npm test                # run all 9 tests
npm run test:backend    # backend only
npm run test:frontend   # frontend only
npm run test:e2e        # E2E only
```

---

## Backend tests (`backend/tests/api.test.mjs`)

Tool: **Vitest + Supertest** against the real test MongoDB database.

| # | Test | Expects |
|---|------|---------|
| 1 | Register a valid user | 201, email in body, no `passwordHash` |
| 2 | Register with too-short name/password | 400 with error message |
| 3 | Register the same email twice | 400 on second attempt |

---

## Frontend tests (`frontend/src/test/Login.test.jsx`)

Tool: **Vitest + React Testing Library** (jsdom). `loginService` and `useNavigate` are mocked — no real network calls.

| # | Test | Expects |
|---|------|---------|
| 1 | Render Login page | "OwlCook" heading is in the DOM |
| 2 | Click Login with empty fields | error "Please fill in all fields!" appears |
| 3 | Render Login page | email and password inputs are present |

---

## E2E tests (`e2e/owlcook.spec.js`)

Tool: **Playwright** (Chromium). The config builds the frontend, copies it to `backend/dist`, and starts the server on `http://localhost:4139` before tests run.

| # | Test | Expects |
|---|------|---------|
| 1 | Navigate to `/` | "OwlCook" heading is visible |
| 2 | Navigate to `/` | email and password inputs are visible |
| 3 | Click Login with empty fields | error message appears in real browser |

---

## CI pipeline (`.github/workflows/ci.yml`)

Runs on every push and pull request to `main`/`master`.

```
Install deps → Backend tests → Frontend tests → Build → E2E tests
```

Required GitHub Secrets:

| Secret | Value |
|--------|-------|
| `TEST_MONGODB_URI` | MongoDB Atlas URI for the test database |
| `SECRET` | Express session secret |

---

## Project structure

```
owlcook/
├── backend/
│   ├── tests/api.test.mjs      # backend tests
│   └── vitest.config.mjs
├── frontend/
│   ├── src/test/
│   │   ├── setup.js             # jest-dom matchers
│   │   └── Login.test.jsx       # frontend tests
│   └── vite.config.js           # includes vitest config
├── e2e/
│   └── owlcook.spec.js          # E2E tests
├── playwright.config.js
└── .github/workflows/ci.yml
```
