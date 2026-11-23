// External module imports
import express, { Router } from "express";
import cors from "cors";

// Internal module imports
import { publicCorsOptions, authenticatedCorsOptions } from "../../../config/corsConfig";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import { validateRequest } from "../middleware/validate";
import { flashcardSchemas } from "../validation/flashcardSchemas";
import { ROLE } from "../../../constants/roles";
import { createFlashcard, getFlashcard, getAllFlashcards,
    updateFlashcard, deleteFlashcard } from "../controllers/flashcardController"

const flashcardRouter: Router = express.Router({ mergeParams: true });

/**
 * @openapi
 * /decks/{deckId}/flashcards:
 *   post:
 *     summary: Create a flashcard in a deck.
 *     tags: [Flashcards]
 *     parameters:
 *       - in: path
 *         name: deckId
 *         required: true
 *         description: The ID of the deck in which to create the flashcard.
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
 *                 description: The question displayed on the flashcard.
 *                 example: "What is the main function of mitochondria?"
 *               answer:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 1000
 *                 description: The answer displayed on the flashcard.
 *                 example: "Known as the powerhouse of the cell, mitochondria produce ATP through cellular respiration."
 *               isMastered:
 *                 type: boolean
 *                 default: false
 *                 description: Indicates whether the flashcard has been mastered.
 *     responses:
 *       '201':
 *         description: Flashcard created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Flashcard'
 *             example:
 *               status: success
 *               data:
 *                 id: "flCrd9xK2mPq7vRt"
 *                 deckId: "bwCOdVm9LuiJycWyJNar"
 *                 question: "What is the main function of mitochondria?"
 *                 answer: "Mitochondria produce ATP through cellular respiration, providing energy for the cell."
 *                 isMastered: false
 *                 createdAt: "2026-04-11T16:00:00.000Z"
 *                 updatedAt: "2026-04-11T16:00:00.000Z"
 *               message: "Flashcard created successfully."
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               Unauthorized:
 *                 $ref: '#/components/examples/Unauthorized'
 *       '403':
 *         description: Forbidden.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               Forbidden:
 *                 $ref: '#/components/examples/Forbidden'
 *       '404':
 *         description: Deck not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 message: "Deck with ID kfG6mSJUSRJyDKHyZtre not found"
 *                 code: "NOT_FOUND"
 *               timestamp: "2026-11-21T15:30:00.000Z"
 *       '422':
 *         description: Request validation failed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               Validation:
 *                 $ref: '#/components/examples/Validation'
 */
flashcardRouter.post("/",
    cors(authenticatedCorsOptions),
    authenticate(true),
    isAuthorized(true, {
        hasRole: [ROLE.ADMIN, ROLE.USER]
    }),
    validateRequest(flashcardSchemas.create),
    createFlashcard);

/**
 * @openapi
 * /decks/{deckId}/flashcards/{cardId}:
 *   get:
 *     summary: Get a flashcard by ID.
 *     tags: [Flashcards]
 *     parameters:
 *       - in: path
 *         name: deckId
 *         required: true
 *         description: The ID of the deck containing the flashcard.
 *         schema:
 *           type: string
 *       - in: path
 *         name: cardId
 *         required: true
 *         description: The ID of the flashcard to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Flashcard retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Flashcard'
 *             example:
 *               status: success
 *               data:
 *                 id: "flCrd3nL8wXq5jKs"
 *                 deckId: "bwCOdVm9LuiJycWyJNar"
 *                 question: "What role do ribosomes play in a cell?"
 *                 answer: "They synthesize proteins by translating mRNA."
 *                 isMastered: true
 *                 createdAt: "2026-04-11T16:05:00.000Z"
 *                 updatedAt: "2026-04-11T16:30:00.000Z"
 *               message: "Flashcard retrieved successfully."
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               Unauthorized:
 *                 $ref: '#/components/examples/Unauthorized'
 *       '403':
 *         description: Forbidden.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               Forbidden:
 *                 $ref: '#/components/examples/Forbidden'
 *       '404':
 *         description: Flashcard or deck not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               DeckNotFound:
 *                 summary: Deck not found.
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Deck with ID kfG6mSJUSRJyDKHyZtre not found"
 *                     code: "NOT_FOUND"
 *                   timestamp: "2026-11-21T15:30:00.000Z"
 *               FlashcardNotFound:
 *                 summary: Flashcard not found.
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Flashcard with ID 6mipKSt9tabktmrpw66f not found"
 *                     code: "NOT_FOUND"
 *                   timestamp: "2026-11-21T15:30:00.000Z"
 */
flashcardRouter.get("/:cardId",
    cors(publicCorsOptions),
    authenticate(false),
    isAuthorized(false, {
        hasRole: [ROLE.ADMIN, ROLE.USER]
    }),
    validateRequest(flashcardSchemas.getById),
    getFlashcard);

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
 *         description: The ID of the deck whose flashcards will be retrieved.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Flashcards retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       description: The number of flashcards returned.
 *                     data:
 *                       type: array
 *                       description: A list of flashcards in the deck.
 *                       items:
 *                         $ref: '#/components/schemas/Flashcard'
 *             example:
 *               status: success
 *               count: 2
 *               data:
 *                 - id: "flCrd9xK2mPq7vRt"
 *                   deckId: "bwCOdVm9LuiJycWyJNar"
 *                   question: "What is the main function of mitochondria?"
 *                   answer: "Mitochondria produce ATP through cellular respiration, providing energy for the cell."
 *                   isMastered: true
 *                   createdAt: "2026-04-11T16:00:00.000Z"
 *                   updatedAt: "2026-11-21T15:00:00.000Z"
 *                 - id: "flCrd3nL8wXq5jKs"
 *                   deckId: "bwCOdVm9LuiJycWyJNar"
 *                   question: "What role do ribosomes play in a cell?"
 *                   answer: "They synthesize proteins by translating mRNA."
 *                   isMastered: true
 *                   createdAt: "2026-04-11T16:05:00.000Z"
 *                   updatedAt: "2026-04-11T16:30:00.000Z"
 *               message: "Flashcards retrieved successfully."
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               Unauthorized:
 *                 $ref: '#/components/examples/Unauthorized'
 *       '403':
 *         description: Forbidden.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               Forbidden:
 *                 $ref: '#/components/examples/Forbidden'
 *       '404':
 *         description: Deck not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 message: "Deck with ID kfG6mSJUSRJyDKHyZtre not found"
 *                 code: "NOT_FOUND"
 *               timestamp: "2026-11-21T15:30:00.000Z"
 */
flashcardRouter.get("/",
    cors(publicCorsOptions),
    authenticate(false),
    isAuthorized(false, {
        hasRole: [ROLE.ADMIN, ROLE.USER]
    }),
    validateRequest(flashcardSchemas.list),
    getAllFlashcards);

/**
 * @openapi
 * /decks/{deckId}/flashcards/{cardId}:
 *   put:
 *     summary: Update a flashcard.
 *     tags: [Flashcards]
 *     parameters:
 *       - in: path
 *         name: deckId
 *         required: true
 *         description: The ID of the deck containing the flashcard.
 *         schema:
 *           type: string
 *       - in: path
 *         name: cardId
 *         required: true
 *         description: The ID of the flashcard to update.
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
 *                 description: Indicates whether the flashcard has been mastered.
 *                 example: true
 *     responses:
 *       '200':
 *         description: Flashcard updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Flashcard'
 *             example:
 *               status: success
 *               data:
 *                 id: "flCrd9xK2mPq7vRt"
 *                 deckId: "bwCOdVm9LuiJycWyJNar"
 *                 question: "What is the main function of mitochondria?"
 *                 answer: "Mitochondria produce ATP through cellular respiration, providing energy for the cell."
 *                 isMastered: true
 *                 createdAt: "2026-04-11T16:00:00.000Z"
 *                 updatedAt: "2026-11-21T15:00:00.000Z"
 *               message: "Flashcard updated successfully."
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               Unauthorized:
 *                 $ref: '#/components/examples/Unauthorized'
 *       '403':
 *         description: Forbidden.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               Forbidden:
 *                 $ref: '#/components/examples/Forbidden'
 *       '404':
 *         description: Flashcard or deck not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               DeckNotFound:
 *                 summary: Deck not found.
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Deck with ID kfG6mSJUSRJyDKHyZtre not found"
 *                     code: "NOT_FOUND"
 *                   timestamp: "2026-11-21T15:30:00.000Z"
 *               FlashcardNotFound:
 *                 summary: Flashcard not found.
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Flashcard with ID 6mipKSt9tabktmrpw66f not found"
 *                     code: "NOT_FOUND"
 *                   timestamp: "2026-11-21T15:30:00.000Z"
 *       '422':
 *         description: Request validation failed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               Validation:
 *                 $ref: '#/components/examples/Validation'
 */
flashcardRouter.put("/:cardId",
    cors(authenticatedCorsOptions),
    authenticate(true),
    isAuthorized(true, {
        hasRole: [ROLE.ADMIN, ROLE.USER]
    }),
    validateRequest(flashcardSchemas.update),
    updateFlashcard);

/**
 * @openapi
 * /decks/{deckId}/flashcards/{cardId}:
 *   delete:
 *     summary: Delete a flashcard.
 *     tags: [Flashcards]
 *     parameters:
 *       - in: path
 *         name: deckId
 *         required: true
 *         description: The ID of the deck containing the flashcard.
 *         schema:
 *           type: string
 *       - in: path
 *         name: cardId
 *         required: true
 *         description: The ID of the flashcard to delete.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Flashcard deleted successfully.
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
 *             example:
 *               status: success
 *               data: null
 *               message: "Flashcard deleted successfully."
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               Unauthorized:
 *                 $ref: '#/components/examples/Unauthorized'
 *       '403':
 *         description: Forbidden.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               Forbidden:
 *                 $ref: '#/components/examples/Forbidden'
 *       '404':
 *         description: Flashcard or deck not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               DeckNotFound:
 *                 summary: Deck not found.
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Deck with ID kfG6mSJUSRJyDKHyZtre not found"
 *                     code: "NOT_FOUND"
 *                   timestamp: "2026-11-21T15:30:00.000Z"
 *               FlashcardNotFound:
 *                 summary: Flashcard not found.
 *                 value:
 *                   success: false
 *                   error:
 *                     message: "Flashcard with ID 6mipKSt9tabktmrpw66f not found"
 *                     code: "NOT_FOUND"
 *                   timestamp: "2026-11-21T15:30:00.000Z"
 */
flashcardRouter.delete("/:cardId",
    cors(authenticatedCorsOptions),
    authenticate(true),
    isAuthorized(true, {
        hasRole: [ROLE.ADMIN, ROLE.USER]
    }),
    validateRequest(flashcardSchemas.delete),
    deleteFlashcard);

export default flashcardRouter;