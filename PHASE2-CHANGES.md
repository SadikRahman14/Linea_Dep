# Linea - Phase 2: Application fixes before deployment

This patch is designed to apply to the **Phase 1 clean ZIP** of Linea.

## What changed
- MongoDB: connect to complete Atlas or local URI with `dbName: "linea"`.
- HTTP: load dotenv first; JSON error responses; add GET `/health`.
- Auth: fix refresh-token endpoint (no access-token dependency), rotate refresh cookie, HTTPS-aware httpOnly cookies, remove password/token console logs and token-bearing API response fields.
- Frontend: Axios retries once after a shared refresh-cookie request, same-origin HOST default for future one-service hosting.
- Socket.IO: authenticate the handshake with access-token cookie; stop trusting userId/sender from client; use per-user rooms for multiple tabs; restrict channel sends to members; reconnect after refreshing expired cookie.
- Channel HTTP API: verify membership for reads and restrict inviting members to the admin.
- Messaging UI: fix direct-message file recipient, remove an undefined debug variable, and fix profile-image update response handling.

## Apply this patch in your local Phase 1 repository

1. Download `Linea-Phase2.patch` and move it to the parent folder containing your Linea project, or anywhere convenient.
2. From the **Linea** project root, make sure you have committed all your own work: `git status`.
3. `git apply --check "../Linea-Phase2.patch"` (adjust the path to where you saved it).
4. `git apply "../Linea-Phase2.patch"`.
5. `git diff --check`.
6. Run `npm ci --prefix server` and `npm ci --prefix client` if not already installed.
7. Run `npm run build --prefix client`; run each app separately with `npm run dev --prefix server` and `npm run dev --prefix client`.
8. Test local signup, login, logout, refresh after cookie expiry, DMs with two accounts, channel messages, and unauthorized channel access.
9. Commit and push after testing: `git add . && git commit -m "fix: prepare auth and realtime messaging for production" && git push`.

## Important: Not yet safe to deploy
- File attachments and profile images still use public local paths and ephemeral disk storage. Do NOT deploy this as a real chat service until moving these files to persistent protected storage.
- Production single-domain hosting, frontend static serving, security headers, rate limiting, input validation, and MongoDB Atlas configuration remain for later phases.
- `accessCookieOptions` and `refreshCookieOptions` use 15m and 7d, matching `.env.example`. If you customize token expiration settings, update these cookie durations too.
- The server still serves `GET /` as a debug response. In a later phase we will serve the built React app from Express instead.
