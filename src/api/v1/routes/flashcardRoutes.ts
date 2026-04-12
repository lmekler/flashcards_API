import express, { Router } from "express";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import { validateRequest } from "../middleware/validate";
import { flashcardSchemas } from "../validation/flashcardSchemas";
import { createFlashcard, getFlashcard, getAllFlashcards,
    updateFlashcard, deleteFlashcard } from "../controllers/flashcardController"

const flashcardRouter: Router = express.Router({ mergeParams: true });

/**
 * @openapi
 * /decks/{deckId}/flashcards:
 *   post:
 *     summary: Create a flashcard in a deck
 *     tags: [Flashcards]
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
 *             required: 
 *               - question
 *               - answer
 *             properties:
 *               question:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 500
 *                 description: The question on the flashcard
 *                 example: "What is the mitochrondia?"
 *               answer:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 1000
 *                 description: The answer on the flashcard
 *                 example: "The mitochrondia is the powerhouse of the cell."
 *               isMastered:
 *                 type: boolean
 *                 default: false
 *                 description: Whether the user has mastered this flashcard
 *     responses:
 *       '201':
 *         description: Flashcard created successfully
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Flashcard'
 *       '400':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Deck not found
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 */
flashcardRouter.post("/", 
    authenticate,
    isAuthorized({ 
        hasRole: ["user"], 
        allowSameUser: true
    }),
    validateRequest(flashcardSchemas.create),
    createFlashcard);

/**
 * @openapi
 * /decks/{deckId}/flashcards/{cardId}:
 *   get:
 *     summary: Get a flashcard by ID
 *     tags: [Flashcards]
 *     parameters:
 *       - in: path
 *         name: deckId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Flashcard retrieved successfully
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Flashcard'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Not found
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 */
flashcardRouter.get("/:cardId", validateRequest(flashcardSchemas.getById), getFlashcard);

/**
 * @openapi
 * /decks/{deckId}/flashcards:
 *   get:
 *     summary: Get all flashcards in a deck
 *     tags: [Flashcards]
 *     parameters:
 *       - in: path
 *         name: deckId
 *         required: true
 *         schema:
 *           type: string
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
 *     responses:
 *       '200':
 *         description: Flashcards retrieved successfully
 *         content:
 *           application/json:
 *             type: object
 *             properties:
 *               flashcards:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Flashcard'
 *               total:
 *                 type: integer
 *               page:
 *                 type: integer
 *               totalPages:
 *                 type: integer
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Deck not found
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 */
flashcardRouter.get("/", validateRequest(flashcardSchemas.list), getAllFlashcards);

/**
 * @openapi
 * /decks/{deckId}/flashcards/{cardId}:
 *   put:
 *     summary: Update a flashcard
 *     tags: [Flashcards]
 *     parameters:
 *       - in: path
 *         name: deckId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isMastered:
 *                 type: boolean
 *                 default: false
 *                 description: Whether the user has mastered this flashcard
 *     responses:
 *       '200':
 *         description: Flashcard updated successfully
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Flashcard'
 *       '400':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Not found
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 */
flashcardRouter.put("/:cardId", 
    authenticate,
    isAuthorized({ 
        hasRole: ["user"], 
        allowSameUser: true
    }),
    validateRequest(flashcardSchemas.update),
    updateFlashcard);

/**
 * @openapi
 * /decks/{deckId}/flashcards/{cardId}:
 *   delete:
 *     summary: Delete a flashcard
 *     tags: [Flashcards]
 *     parameters:
 *       - in: path
 *         name: deckId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Flashcard deleted successfully
 *         content:
 *           application/json:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Not found
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Error'
 */
flashcardRouter.delete("/:cardId", 
    authenticate,
    isAuthorized({ 
        hasRole: ["user"], 
        allowSameUser: true 
    }),
    validateRequest(flashcardSchemas.delete),
    deleteFlashcard);

export default flashcardRouter;