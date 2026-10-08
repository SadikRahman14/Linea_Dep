// Load environment variables before importing modules that read process.env.
import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import connectDB from "./db/index.js";
import setupSocket from "./socket.js";
import authRoutes from "./src/routes/auth.route.js";
import contactRoutes from "./src/routes/contacts.route.js";
import messagesRoutes from "./src/routes/messages.route.js";
import channelRouter from "./src/routes/channel.route.js";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.ORIGIN || false,
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// TEMPORARY local upload storage. Replace before deploying (Phase 4).
app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/messages", messagesRoutes);
app.use("/api/v1/channel", channelRouter);

// In production, Express serves the Vite build from its sibling client directory.
// Use import.meta.url because npm --prefix server changes the working directory.
const clientDist = fileURLToPath(new URL("../client/dist/", import.meta.url));
const clientIndex = path.join(clientDist, "index.html");
if (existsSync(clientIndex)) {
  app.use(express.static(clientDist));
  app.get("/{*splat}", (req, res, next) => {
    if (["/api/", "/uploads/", "/socket.io/"].some(prefix => req.path.startsWith(prefix))) {
      return next();
    }
    res.sendFile(clientIndex);
  });
} else {
  // During local backend-only development, / still responds without a build.
  app.get("/", (req, res) => res.send("Server is live (React has not been built)"));
}

app.use((req, res) => res.status(404).json({ success: false, message: "Not found" }));

// Return machine-readable errors so the frontend can handle expired cookies.
app.use((err, req, res, next) => {
  const status = Number.isInteger(err.statusCode) && err.statusCode >= 400 && err.statusCode < 600
    ? err.statusCode : 500;
  if (status >= 500) console.error("Request failed:", err);
  const message = status >= 500 ? "Internal server error" : err.message;
  res.status(status).json({ success: false, message, error: message });
});

const server = http.createServer(app);
setupSocket(server);

connectDB()
  .then(() => server.listen(port, () => console.log(`Server running on port ${port}`)))
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exitCode = 1;
  });
