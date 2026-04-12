import express, { Router } from "express";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import cardRouter from "./flashcardRoutes";
import { validateRequest } from "../middleware/validate";
import { deckSchemas } from "../validation/deckSchemas";
import { createDeck, getDeck, getAllDecks,
    updateDeck, deleteDeck } from "../controllers/deckController"

const deckRouter: Router = express.Router();

/**
 * @openapi
 * /decks:
 *   post:
 *     summary: Create a new deck
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
 *                 min: 1
 *                 max: 100
 *                 description: The title of the deck
 *                 example: "Biology 1115"
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 description: The description of the deck
 *                 example: "This deck contains flashcards for Biology 1115 course."
 *     responses:
 *       '201':
 *         description: Deck created successfully
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Deck'
 *       '400':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error':
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error':
 */
deckRouter.post("/", 
    authenticate,
  isAuthorized({ hasRole: ["user"] }),
  validateRequest(deckSchemas.create),
  createDeck);
 
/**
 * @openapi
 * /decks/{deckId}:
 *   get:
 *     summary: Get a deck by ID
 *     tags: [Decks]
 *     parameters:
 *       - in: path
 *         name: deckId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Deck retrieved successfully
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Deck'
 *       '404':
 *         description: Deck not found
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error':
 */
deckRouter.get("/:deckId", validateRequest(deckSchemas.getById), getDeck);

/**
 * @openapi
 * /decks:
 *   get:
 *     summary: Get a list of decks with optional filtering
 *     tags: [Decks]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 20
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [title, createdAt, updatedAt]
 *           default: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       '200':
 *         description: Decks retrieved successfully
 *         content:
 *           application/json:
 *             type: object
 *             properties:
 *               decks:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Deck'
 *               total:
 *                 type: integer
 *               page:
 *                 type: integer
 *               totalPages:
 *                 type: integer
 */
deckRouter.get("/", validateRequest(deckSchemas.list), getAllDecks);

/**
 * @openapi
 * /decks/{deckId}:
 *   put:
 *     summary: Update a deck by ID
 *     tags: [Decks]
 *     parameters:
 *       - in: path
 *         name: deckId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 description: The description of the deck
 *                 example: "This deck contains flashcards for Biology 1115 course."
 *     responses:
 *       '200':
 *         description: Deck updated successfully
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Deck'
 *       '400':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error':
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error':
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error':
 *       '404':
 *         description: Deck not found
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error':
 */
deckRouter.put("/:deckId", 
    authenticate,
    isAuthorized({ 
        hasRole: ["user"], 
        allowSameUser: true
    }),
    validateRequest(deckSchemas.update),
    updateDeck);

/**
 * @openapi
 * /decks/{deckId}:
 *   delete:
 *     summary: Delete a deck by ID
 *     tags: [Decks]
 *     parameters:
 *       - in: path
 *         name: deckId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Deck deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error':
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error':
 *       '404':
 *         description: Deck not found
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error':
 */
deckRouter.delete("/:deckId", 
    authenticate,
    isAuthorized({ 
        hasRole: ["user"], 
        allowSameUser: true 
    }),
    validateRequest(deckSchemas.delete),
    deleteDeck);

// Mount cardRouter under deckRouter
deckRouter.use('/:deckId/flashcards', cardRouter);

export default deckRouter;