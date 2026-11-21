// External module imports
import Joi, { ObjectSchema } from "joi";

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
export const deckSchemas = {
    create: {
        body: Joi.object({
            visibility: Joi.boolean().optional().messages({
                "boolean.base": "Visibility must be a boolean value"
            }),
            title: Joi.string().trim().min(1).max(100).required().messages({
                "any.required": "Title is required",
                "string.empty": "Title cannot be empty",
                "string.min": "Title must be at least 1 character",
                "string.max": "Title cannot exceed 100 characters"
            }),
            description: Joi.string().trim().max(500).optional().messages({
                "string.max": "Description cannot exceed 500 characters"
            })
        })
    },

    getById: {
        params: Joi.object({
            deckId: Joi.string().required().messages({
                "any.required": "Deck ID is required",
                "string.empty": "Deck ID cannot be empty",
            })
        })
    },

    update: {
        params: Joi.object({
            deckId: Joi.string().required().messages({
                "any.required": "Deck ID is required",
                "string.empty": "Deck ID cannot be empty",
            })
        }),
        body: Joi.object({
            visibility: Joi.boolean().optional().messages({
                "boolean.base": "Visibility must be a boolean value"
            }),
            description: Joi.string().trim().max(500).allow("").optional().messages({
                "string.max": "Description cannot exceed 500 characters"
            })
        }).min(1)
    },

    delete: {
        params: Joi.object({
            deckId: Joi.string().required().messages({
                "any.required": "Deck ID is required",
                "string.empty": "Deck ID cannot be empty",
            })
        })
    },

    list: {
        query: Joi.object({
            page: Joi.number().integer().min(1).default(1),
            limit: Joi.number().integer().min(1).max(50).default(20),
            userId: Joi.string().optional(),
            sortBy: Joi.string().valid("title", "createdAt", "updatedAt").default("createdAt"),
            sortOrder: Joi.string().valid("asc", "desc").default("desc")
        })
    }
};

/**
 * @openapi
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       required:
 *         - error
 *       properties:
 *         error:
 *           type: string
 *           description: Error type or code, followed by a readable error message
 */