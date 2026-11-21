// External module imports
import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Flashcards API",
            version: "1.0.0",
            description: `
A REST API for creating decks of flashcards and studying them.

**Stack:** Node.js, Express, TypeScript, Firebase (Firestore and Auth), Joi validation, Jest tests.

### Authentication
Most endpoints require a Firebase ID token, sent as a Bearer token in the
\`Authorization\` header. <!-- FILL IN: how a visitor can get a token, or say which endpoints are public -->

### Heads up
This API runs on a free hosting plan, so the first request after a quiet
period can take up to a minute while the server wakes up.`,
            contact: {
                name: "Leann Mekler",
                url: "https://github.com/lmekler/flashcards_API",
            },
        },
        servers: [
             {
                url: "https://bed-capstone-project.onrender.com/api/v1",
                description: "Live demo",
            },
            {
                url: "http://localhost:3000/api/v1",
                description: "Local server",
            },
        ],
        tags: [
            { name: "Decks", description: "Create and manage decks of flashcards." },
            { name: "Flashcards", description: "Create and manage the cards inside a deck." },
            { name: "Users", description: "User accounts and profiles." },
            { name: "Admin", description: "Administrator-only operations." },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [
        "./src/api/v1/routes/*.ts",
        "./src/api/v1/routes/**/*.ts",
        "./src/api/v1/docs/schemas/*.ts"
    ], // Path to the API docs and schemas
};

// Generate the Swagger spec
export const generateSwaggerSpec = (): object => {
    return swaggerJsdoc(swaggerOptions);
};