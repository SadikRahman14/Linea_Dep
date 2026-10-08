# Linea — Phase 3: Deploy a free test site on Render

This phase makes the **built React SPA** load from the existing Express server (same origin for cookies and Socket.IO). The patch assumes Phase 2 has already been applied. It does not migrate uploads.

## Before deployment

- Confirm the GitHub repo includes the Phase 2 fixes but does **not** include local `.env` files or uploads.
- Keep `client/.env` only on your own computer. Do not set `VITE_SERVER_URL` in Render; the client then uses `window.location.origin`.
- Treat this as a **limited test deployment** (the URL is publicly reachable): `/uploads/...` is still saved locally and will disappear when Render spins down or redeploys. Profile images and file attachments must be migrated to persistent storage before real users. Do not test with personal or sensitive files. These static upload endpoints also do not enforce file-level access controls.

## Render dashboard

1. Dashboard > New > Web Service > connect your GitHub **Linea** repository.
2. Choose **Node** runtime and **Free** instance plan.
3. Branch: `main`; Root Directory: **blank**, because the build uses both `client/` and `server/`.
4. Build command: `npm ci --include=dev --prefix client && npm run build --prefix client && npm ci --omit=dev --prefix server`
5. Start command: `npm start --prefix server`
6. Node.js version: `.node-version` pins `22.22.0`.
7. Environment variables:
   - `DATABASE_URI`: your Atlas connection string with the password (do not commit).
   - `NODE_ENV`: `production`
   - `ACCESS_TOKEN_SECRET`: a newly generated long random secret
   - `ACCESS_TOKEN_EXPIRY`: `15m`
   - `REFRESH_TOKEN_SECRET`: a **different** newly generated long random secret
   - `REFRESH_TOKEN_EXPIRY`: `7d`
   - Do **not** set `VITE_SERVER_URL` (single-origin React + backend).
   - Do **not** set `PORT`; Render supplies the port automatically.
   - Do **not** set `ORIGIN`; it is only needed when the dev frontend is served on a different origin.
8. Create Web Service. Your URL will look like `https://<name>.onrender.com`.
9. Render Dashboard > service > Connect > Outbound: obtain outbound IP ranges, and add to MongoDB Atlas > Security > Network Access. Allowlist only the needed ranges.
10. Test `https://<name>.onrender.com/health` (should return `{"status":"ok"}`), load `/`, refresh `/auth` and `/chat`, test account signup/login, and message with two browser sessions.

## Notes

- Render Free spins down after 15 minutes without inbound HTTP traffic or WebSocket messages; the first connection after idle can take about one minute.
- Render Free local storage is ephemeral. **Do not use local profile images or attachments for a real chat deployment.**
- If you see an Axios request from the deployed frontend to `localhost:3001`, a `VITE_SERVER_URL` value leaked into the build. Remove this build variable and redeploy.
