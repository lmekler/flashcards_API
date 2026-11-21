/**
 * @openapi
 * components:
 *   schemas:
 *     Deck:
 *       type: object
 *       required:
 *         - id
 *         - userId
 *         - visibility
 *         - title
 *         - description
 *         - cardCount
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the deck.
 *           example: "bwCOdVm9LuiJycWyJNar"
 *         userId:
 *           type: string
 *           description: The ID of the user who owns the deck.
 *           example: "dxddMFNEukf56t6rSxvtdbSUWf23"
 *         visibility:
 *           type: boolean
 *           description: Whether the deck is private or public.
 *           example: true
 *         title:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           description: The title of the deck.
 *           example: "Human Biology Chapter 1"
 *         description:
 *           type: string
 *           minLength: 0
 *           maxLength: 500
 *           default: ""
 *           description: A description of the deck.
 *           example: "The fundamentals of human biology, including cell structure, organelles, and their functions."
 *         cardCount:
 *           type: integer
 *           default: 0
 *           description: The amount of flashcards in the deck.
 *           example: 20
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp for when the deck was created.
 *           example: "2026-04-11T16:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp for last time the deck was updated.
 *           example: "2026-04-11T16:30:00Z"
 */