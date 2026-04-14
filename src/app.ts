// External module imports
import express, { Express } from "express";

// Internal module imports
import {
    accessLogger,
    errorLogger,
    consoleLogger,
} from "./api/v1/middleware/logger";
import errorHandler from "./api/v1/middleware/errorHandler";
import setupSwagger from "./config/swagger";
import adminRoutes from "./api/v1/routes/adminRoutes";
import userRoutes from "./api/v1/routes/userRoutes";
import deckRouter from "./api/v1/routes/deckRoutes";

// Initialize Express application
const app: Express = express();

// Logging middleware (should be applied early in the middleware stack)
if (process.env.NODE_ENV === "production") {
    // In production, log to files
    app.use(accessLogger);
    app.use(errorLogger);
} else {
    // In development, log to console for immediate feedback
    app.use(consoleLogger);
}

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

// Route handler for admins
app.use("/api/v1/admin", adminRoutes);

// Route handler for users
app.use("/api/v1/users", userRoutes);

// Route handler for decks
app.use("/api/v1/decks", deckRouter);

// Setup Swagger
setupSwagger(app);

// Global error handling middleware (MUST be applied last)
app.use(errorHandler);

export default app;