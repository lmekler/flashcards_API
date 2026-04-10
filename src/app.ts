import express, { Express } from "express";
import deckRouter from "./api/v1/routes/deckRoutes";
import adminRoutes from "./api/v1/routes/adminRoutes";
import userRoutes from "./api/v1/routes/userRoutes";
import errorHandler from "./api/v1/middleware/errorHandler";

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

// Route handler for users
app.use("/api/v1/users", userRoutes);

// Route handler for admins
app.use("/api/v1/admin", adminRoutes);

// Global error handling middleware (MUST be applied last)
app.use(errorHandler);

export default app;