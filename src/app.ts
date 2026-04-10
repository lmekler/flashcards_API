import express, { Express } from "express";
import deckRouter from "./api/v1/routes/deckRoutes";

// Initialize Express application
const app: Express = express();

// Health check endpoint
app.get("/api/v1/health", (req, res) => {
    res.json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});

// Body parsing middleware
app.use(express.json());

// Route handler for decks
app.use("/api/v1/decks", deckRouter);

export default app;