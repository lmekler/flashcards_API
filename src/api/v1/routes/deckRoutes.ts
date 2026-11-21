// External module imports
import express, { Router } from "express";
import cors from "cors";

// Internal module imports
import { publicCorsOptions, authenticatedCorsOptions } from "../../../config/corsConfig";
import { ROLE } from "../../../constants/roles";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import { validateRequest } from "../middleware/validate";
import { deckSchemas } from "../validation/deckSchemas";
import cardRouter from "./flashcardRoutes";
import { createDeck, getDeck, getAllDecks,
    updateDeck, deleteDeck } from "../controllers/deckController"

const deckRouter: Router = express.Router();

/**
 * @openapi
 * /decks:
 *   post:
 *     summary: Create a new deck.
 *     tags: [Decks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 description: The title of the deck.
 *                 example: "Human Biology Chapter 1"
 *               description:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 500
 *                 description: Optional description of the deck. If provided, it cannot be empty or contain only whitespace.
 *                 example: "The fundamentals of human biology, including cell structure, organelles, and their functions."
 *     responses:
 *       '201':
 *         description: Deck created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Deck'
 *       '400':
 *         description: Invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
deckRouter.post("/", 
    cors(authenticatedCorsOptions),
    authenticate(true),
    isAuthorized(true, { 
        hasRole: [ROLE.ADMIN, ROLE.USER]
    }),
    validateRequest(deckSchemas.create),
    createDeck);
 
/**
 * @openapi
 * /decks/{deckId}:
 *   get:
 *     summary: Get a deck by ID.
 *     tags: [Decks]
 *     parameters:
 *       - in: path
 *         name: deckId
 *         required: true
 *         description: The ID of the deck to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Deck retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Deck'
 *       '404':
 *         description: Deck not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
deckRouter.get("/:deckId", 
    cors(publicCorsOptions), 
    authenticate(false),
    isAuthorized(false, {
        hasRole: [ROLE.ADMIN, ROLE.USER]
    }),
    validateRequest(deckSchemas.getById), 
    getDeck);

/**
 * @openapi
 * /decks:
 *   get:
 *     summary: Get a list of decks.
 *     tags: [Decks]
 *     responses:
 *       '200':
 *         description: Decks retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       description: A list of decks.
 *                       items:
 *                         $ref: '#/components/schemas/Deck'
 *                     count:
 *                       type: integer
 *                       description: The number of decks returned.
 */
deckRouter.get("/", 
    cors(publicCorsOptions), 
    authenticate(false),
    isAuthorized(false, {
        hasRole: [ROLE.ADMIN, ROLE.USER]
    }),
    validateRequest(deckSchemas.list), 
    getAllDecks);

/**
 * @openapi
 * /decks/{deckId}:
 *   put:
 *     summary: Update a deck by ID.
 *     tags: [Decks]
 *     parameters:
 *       - in: path
 *         name: deckId
 *         required: true
 *         description: The ID of the deck to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 500
 *                 description: The updated description of the deck.
 *                 example: "An introduction to the structure, functions, and essential processes of the human body."
 *     responses:
 *       '200':
 *         description: Deck updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Deck'
 *       '400':
 *         description: Invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Forbidden.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Deck not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
deckRouter.put("/:deckId",
    cors(authenticatedCorsOptions), 
    authenticate(true),
    isAuthorized(true, { 
        hasRole: [ROLE.ADMIN, ROLE.USER]
    }),
    validateRequest(deckSchemas.update),
    updateDeck);

/**
 * @openapi
 * /decks/{deckId}:
 *   delete:
 *     summary: Delete a deck by ID.
 *     tags: [Decks]
 *     parameters:
 *       - in: path
 *         name: deckId
 *         required: true
 *         description: The ID of the deck to delete.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Deck deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       nullable: true
 *                       description: No data is returned after deletion.
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Forbidden.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Deck not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
deckRouter.delete("/:deckId", 
    cors(authenticatedCorsOptions),
    authenticate(true),
    isAuthorized(true, { 
        hasRole: [ROLE.ADMIN, ROLE.USER]
    }),
    validateRequest(deckSchemas.delete),
    deleteDeck);

// Mount cardRouter under deckRouter
deckRouter.use('/:deckId/flashcards', cardRouter);

export default deckRouter;