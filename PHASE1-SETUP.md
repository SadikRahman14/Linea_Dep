# Linea — Phase 1: Clean repository setup

This folder is a clean **source-only** copy of the supplied Linea project, ready for a new Git history. The original project and ZIP remain unchanged. The frontend and backend behavior have **not** been modified.

## What has been removed

- The original `.git` directory and all prior commit history
- `client/.env` and `server/.env`, including any secrets
- All `node_modules` directories and compiled build caches
- All `server/uploads` user files and profiles (which must not be pushed to GitHub)

The original ZIP retains a copy of any uploads you might need to migrate later. Do not upload that ZIP to a public repository or share it; it still contains the old environment files and Git history.

## Step 1: Install Git and Node.js

Check in a PowerShell terminal:

```powershell
git --version
node --version
npm --version
```

## Step 2: Configure LOCAL development (do not commit these files)

From inside the cleaned `Linea` folder:

```powershell
Copy-Item client/.env.example client/.env
Copy-Item server/.env.example server/.env
```

Edit `.env` values for your own development database and local URLs. The example values are placeholders, not working database credentials. Use `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` **twice** to create separate JWT secrets. Paste each into your local `server/.env`, never into GitHub.

Install dependencies when you want to run locally:

```powershell
npm ci --prefix client
npm ci --prefix server
```

Run the server and client in **separate** PowerShell terminals (a local MongoDB instance must be running unless you use Atlas):

```powershell
npm run dev --prefix server
```

```powershell
npm run dev --prefix client
```

## Step 3: Rotate old credentials before any public deployment

The previous Git index tracked **both** environment files. Rotate the existing MongoDB password or replace its database user; generate fresh ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET. If the old repository was previously pushed anywhere, a new repository will **not erase** exposed secrets from the old one.

## Step 4: Initialize a BRAND-NEW repository

Open PowerShell in the cleaned `Linea` directory, not the original extracted folder:

```powershell
git init -b main
git add .
git status --short
git ls-files client/.env server/.env
```

**Important:** The `git ls-files` command above must show **no output**. If it outputs either file, stop before committing. Confirm `node_modules/`, `server/uploads/`, and `.git/` are not in the staged files.

```powershell
git commit -m "chore: prepare Linea for deployment"
```

## Step 5: Create a new empty GitHub repository

1. On GitHub, create a **new empty repository**, for example `linea` or `linea-mern`.
2. Keep GitHub's README, .gitignore, and License options unchecked (they are already in the folder or can be added later).
3. In the same cleaned `Linea` directory, run:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO` with your account/repository. GitHub authentication may be requested.

## Verify GitHub contents

Expected at the repository root:

- `.gitignore`
- `client/`, `server/`
- `client/.env.example`, `server/.env.example`
- `README.md`, `PHASE1-SETUP.md`, `TODOS.md`

NOT expected:

- `.env` containing secrets
- `node_modules`, `server/uploads`, `dist`, or original Git history

## Next phase

Phase 2 will repair auth/session cookie handling, Socket.IO authentication, database URI handling, and other deployment blockers. This source-only archive is not yet guaranteed to deploy or run correctly on a free production server.
