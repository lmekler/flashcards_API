// External module imports
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

// Internal module imports
import { generateSwaggerSpec } from "./swaggerOptions";

const setupSwagger = (app: Express): void => {
    const specs = generateSwaggerSpec();
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};

export default setupSwagger;