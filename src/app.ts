// External module imports
import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

dotenv.config();

// Internal module imports
import { helmetConfig } from "./config/helmetConfig";
import {
  publicCorsOptions,
  authenticatedCorsOptions,
} from "./config/corsConfig";
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

// Apply Helmet security
app.use(helmetConfig());

// Serve the generated API documentation
app.use(
    "/docs",
    (_req, res, next) => {
        res.removeHeader("X-Frame-Options");
        res.setHeader(
            "Content-Security-Policy",
            "frame-ancestors 'self' http://localhost:5173 https://leannmekler.vercel.app/"
        );
        next();
    },
    express.static(path.join(__dirname, "../docs"))
);

// Send visitors who open the bare URL to the docs
app.get("/", (_req, res) => {
  res.redirect("/docs");
});

// Logging middleware
if (process.env.NODE_ENV === "production") {
  // In production, log to files
  app.use(accessLogger);
  app.use(errorLogger);
} else {
  // In development, log to console for immediate feedback
  app.use(consoleLogger);
}

// Health check endpoint with public CORS configuration
app.get("/api/v1/health", cors(publicCorsOptions), (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Body parsing middleware
app.use(express.json());

// Route handler for admins with authenticated CORS configuration
app.use("/api/v1/admin", cors(authenticatedCorsOptions), adminRoutes);

// Route handler for users with authenticated CORS configuration
app.use("/api/v1/users", cors(authenticatedCorsOptions), userRoutes);

// Route handler for decks
app.use("/api/v1/decks", deckRouter);

// Setup Swagger
setupSwagger(app);

// Global error handling middleware
app.use(errorHandler);

export default app;
