// External module imports
import Joi, { ObjectSchema } from "joi";

/**
 * @openapi
 * components:
 *   schemas:
 *     Flashcard:
 *       type: object
 *       required:
 *         - question
 *         - answer
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the flashcard
 *           example: "card_1"
 *         question:
 *           type: string
 *           minLength: 1
 *           maxLength: 500
 *           description: The question on the flashcard
 *           example: "What is the mitochondria?"
 *         answer:
 *           type: string
 *           minLength: 1
 *           maxLength: 1000
 *           description: The answer on the flashcard
 *           example: "The mitochondria is the powerhouse of the cell."
 *         isMastered:
 *           type: boolean
 *           default: false
 *           description: Whether the user has mastered this flashcard
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
export const flashcardSchemas = {
    create: {
        params: Joi.object({
            deckId: Joi.string().required().messages({
                "any.required": "Deck ID is required",
                "string.empty": "Deck ID cannot be empty",
            })
        }),
        body: Joi.object({
            question: Joi.string().trim().min(1).max(500).required().messages({
                "any.required": "Question is required",
                "string.empty": "Question cannot be empty",
                "string.min": "Question must be at least 1 character",
                "string.max": "Question cannot exceed 500 characters"
            }),
            answer: Joi.string().trim().min(1).max(1000).required().messages({
                "any.required": "Answer is required",
                "string.empty": "Answer cannot be empty",
                "string.min": "Answer must be at least 1 character",
                "string.max": "Answer cannot exceed 1000 characters"
            }),
            isMastered: Joi.boolean().optional().default(false).messages({
                "boolean.base": "isMastered must be a boolean value"
            }),
        })
    },

    getById: {
        params: Joi.object({
            deckId: Joi.string().required().messages({
                "any.required": "Deck ID is required",
                "string.empty": "Deck ID cannot be empty",
            }),
            cardId: Joi.string().required().messages({
                "any.required": "Card ID is required",
                "string.empty": "Card ID cannot be empty",
            })
        })
    },

    list: {
        params: Joi.object({
            deckId: Joi.string().required().messages({
                "any.required": "Deck ID is required",
                "string.empty": "Deck ID cannot be empty",
            })
        }),
        query: Joi.object({
            page: Joi.number().integer().min(1).default(1),
            limit: Joi.number().integer().min(1).max(50).default(20),
            sortBy: Joi.string().valid("question", "createdAt", "updatedAt").default("createdAt"),
            sortOrder: Joi.string().valid("asc", "desc").default("desc")
        })
    },

    update: {
        params: Joi.object({
            deckId: Joi.string().required().messages({
                "any.required": "Deck ID is required",
                "string.empty": "Deck ID cannot be empty",
            }),
            cardId: Joi.string().required().messages({
                "any.required": "Card ID is required",
                "string.empty": "Card ID cannot be empty",
            })
        }),
        body: Joi.object({
            isMastered: Joi.boolean().optional().default(false).messages({
                "boolean.base": "isMastered must be a boolean value"
            }),
        }).min(1)
    },

    delete: {
        params: Joi.object({
            deckId: Joi.string().required().messages({
                "any.required": "Deck ID is required",
                "string.empty": "Deck ID cannot be empty",
            }),
            cardId: Joi.string().required().messages({
                "any.required": "Card ID is required",
                "string.empty": "Card ID cannot be empty",
            })
        })
    }
};