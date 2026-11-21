/**
 * @openapi
 * components:
 *   schemas:
 *     Flashcard:
 *       type: object
 *       required:
 *         - id
 *         - question
 *         - answer
 *         - isMastered
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the flashcard.
 *           example: "ahBE4jNLYpjlSVGN71O1"
 *         question:
 *           type: string
 *           minLength: 1
 *           maxLength: 500
 *           description: The question on the flashcard.
 *           example: "What is the main function of mitochondria?"
 *         answer:
 *           type: string
 *           minLength: 1
 *           maxLength: 1000
 *           description: The answer on the flashcard.
 *           example: "Known as the powerhouse of the cell, mitochondria produce ATP through cellular respiration."
 *         isMastered:
 *           type: boolean
 *           default: false
 *           description: Whether the user has mastered this flashcard.
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp for when the flashcard was created
 *           example: "2026-04-11T16:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp for last time the flashcard was updated
 *           example: "2026-04-11T16:30:00Z"
 */