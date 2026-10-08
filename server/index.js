import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/index.js";
import setupSocket from "./socket.js"
import http from "http";


dotenv.config();

const app = express();
const port = process.env.PORT || 3001;


app.use(cors({
  origin: process.env.ORIGIN,
  credentials: true
}));


app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"))

app.use(express.json());
app.use(cookieParser()); 

// Debug route to confirm server is running
app.get("/", (req, res) => {
  res.send("Server is live");
});


// Routes

import authRoutes from "./src/routes/auth.route.js";
import contactRoutes from "./src/routes/contacts.route.js";
import messagesRoutes from "./src/routes/messages.route.js";
import channelRouter from "./src/routes/channel.route.js";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/contact", contactRoutes)
app.use("/api/v1/messages", messagesRoutes)
app.use("/api/v1/channel", channelRouter)

const server = http.createServer(app);
setupSocket(server);

connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error("MongoDB connection failed", err);
  });
