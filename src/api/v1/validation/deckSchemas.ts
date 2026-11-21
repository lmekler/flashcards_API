// External module imports
import Joi from "joi";

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