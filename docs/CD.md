# Continuous Deployment (CD) — OwlCook

This document explains how CD is set up for OwlCook and the exact commands needed to get it running on the server.

---

## Overview

When code is pushed to `main`:

1. **CI** runs on GitHub-hosted runners — backend tests, frontend tests, E2E tests.
2. **CD** triggers automatically **only if CI passes** — the self-hosted runner on `10.192.145.179` pulls the latest code, rebuilds the frontend, installs dependencies, and restarts the backend via PM2.

```
git push origin main
        │
        ▼
   CI workflow (GitHub runner)
   ├── backend tests
   ├── frontend tests
   └── E2E tests
        │ (only on success)
        ▼
   CD workflow (self-hosted runner on 10.192.145.179)
   └── ./deploy.sh
       ├── git pull
       ├── npm install
       ├── npm run deploy  ← builds frontend → backend/dist
       └── pm2 restart owlcook
```

---

## Files Added

| File | Purpose |
|------|---------|
| `deploy.sh` | Shell script that updates and restarts the app on the server |
| `.github/workflows/cd.yml` | GitHub Actions workflow that runs `deploy.sh` after CI passes |

---

## Server Details

| Item | Value |
|------|-------|
| Server IP | `10.192.145.179` |
| App URL | `http://10.192.145.179:4139` |
| Project directory | `~/sd/owlcook` |
| PM2 process name | `owlcook` |
| Backend entry | `backend/index.js` |
| Frontend build target | `backend/dist/` |

---

## Part 1 — First-time Setup on the Server

SSH into the server:

```bash
ssh nguyen15@10.192.145.179
```

Clone the project:

```bash
mkdir -p ~/sd
cd ~/sd
git clone git@github.com:Vicientt/owlcook.git owlcook
cd owlcook
```

Install and build everything:

```bash
npm install
npm install --prefix frontend
npm install --prefix backend
npm run deploy
```

> `npm run deploy` builds the Vite frontend and copies `frontend/dist` → `backend/dist`, which Express serves in production.

Create `backend/.env` with:

```
MONGODB_URI=<your-mongodb-atlas-uri>
TEST_MONGODB_URI=<your-test-db-uri>
SECRET=<session-secret>
OPENAI_API_KEY=<your-openai-key>
PORT=4139
```

Start the server manually to confirm it works:

```bash
npm run start --prefix backend
```

Open `http://10.192.145.179:4139` in your browser. Stop with `Ctrl+C` when confirmed.

---

## Part 2 — Start the App with PM2

```bash
cd ~/sd/owlcook/backend
pm2 start index.js --name owlcook
pm2 list
pm2 save
```

Verify the app is still up at `http://10.192.145.179:4139`.

---

## Part 3 — Test deploy.sh Manually

```bash
cd ~/sd/owlcook
./deploy.sh
```

Expected output:

```
Starting deployment...
Installing root dependencies...
Installing frontend dependencies...
Installing backend dependencies...
Building frontend and copying to backend...
Restarting app with PM2...
Deployment complete.
```

Refresh the browser — app should still work.

---

## Part 4 — Install the GitHub Self-Hosted Runner

On GitHub: **Settings → Actions → Runners → New self-hosted runner**  
Choose **Linux → x64**.

GitHub will give you a set of commands. On the server:

```bash
mkdir -p ~/actions-runner
cd ~/actions-runner
```

Paste and run the commands GitHub provides (download, extract, configure). When prompted for labels, press **Enter** to accept the defaults.

Start the runner:

```bash
cd ~/actions-runner
./run.sh
```

> Keep this running. For persistent use, run it in `screen` or `tmux`:
> ```bash
> screen -S runner
> ./run.sh
> # Ctrl+A then D to detach
> ```

Confirm the runner appears as **Online** under **Settings → Actions → Runners** in GitHub.

---

## Part 5 — Push and Watch CD Run

From your local machine:

```bash
git add deploy.sh .github/workflows/cd.yml docs/CD.md
git commit -m "feat: add CD workflow and deploy script"
git push origin main
```

Go to **GitHub → Actions**. You will see:

1. `CI` workflow starts on a GitHub-hosted runner.
2. If CI passes, `CD` workflow starts on the self-hosted runner.
3. CD runs `deploy.sh` on the server.

---

## Part 6 — Prove CD Works (Visible Change)

Make a small visible change in the frontend, for example edit a heading in `frontend/src/app/pages/`:

```bash
git add .
git commit -m "test: visible change to verify CD"
git push origin main
```

After both workflows finish, open `http://10.192.145.179:4139` — your change should be live without any manual steps.

---

## Reflection Answers

**What is the difference between CI and CD?**  
CI (Continuous Integration) automatically runs tests on every push to catch bugs early. CD (Continuous Deployment) automatically deploys the code to the server after CI passes, so working code reaches users without manual steps.

**Why should CD only run after CI passes?**  
To avoid deploying broken code. If tests fail, the current working version stays live until the problem is fixed and CI passes again.

**Why do we need a self-hosted runner for this server?**  
The server at `10.192.145.179` is behind a firewall. GitHub's cloud runners cannot SSH into it. A self-hosted runner installed directly on the server connects outbound to GitHub, bypassing the firewall restriction.

**What role does PM2 play?**  
PM2 keeps the Node.js process alive, restarts it automatically if it crashes, and survives server reboots (via `pm2 save` + startup hook). `deploy.sh` calls `pm2 restart owlcook` to reload the app with zero-downtime intent after each deploy.

**What is still fragile or simple about this deployment setup?**  
- The runner must be started manually (`./run.sh`); it is not registered as a system service.
- Sessions are stored in memory, so PM2 restart logs all users out.
- There is no rollback mechanism — if `deploy.sh` breaks, the old version is gone.
- Secrets in `backend/.env` are managed manually on the server, not through a secrets manager.
