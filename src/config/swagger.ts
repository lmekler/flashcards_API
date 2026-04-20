// External module imports
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import cors from "cors";

// Internal module imports
import { publicCorsOptions } from "./corsConfig";
import { generateSwaggerSpec } from "./swaggerOptions";

const setupSwagger = (app: Express): void => {
    const specs = generateSwaggerSpec();
    // Swagger UI route with public CORS configuration
    app.use("/api-docs", cors(publicCorsOptions), swaggerUi.serve, swaggerUi.setup(specs));
};

export default setupSwagger;