import Joi, { ObjectSchema } from "joi";

// Deck operation schemas organized by request part
export const deckSchemas = {
    // POST /decks - Create new deck
    create: {
        params: Joi.object({
            userId: Joi.string().required().messages({
                "any.required": "User ID is required",
                "string.empty": "User ID cannot be empty",
            })
        }),
        body: Joi.object({
            title: Joi.string().min(1).max(100).required().messages({
                "any.required": "Title is required",
                "string.empty": "Title cannot be empty",
                "string.min": "Title must be at least 1 character",
                "string.max": "Title cannot exceed 100 characters"
            }),
            description: Joi.string().max(500).optional().messages({
                "string.max": "Description cannot exceed 500 characters"
            })
        })
    },

    // GET /decks/:deckId - Get single deck
    getById: {
        params: Joi.object({
            deckId: Joi.string().required().messages({
                "any.required": "Deck ID is required",
                "string.empty": "Deck ID cannot be empty",
            })
        })
    },

    // PUT /decks/:deckId - Update deck
    update: {
        params: Joi.object({
            userId: Joi.string().required().messages({
                "any.required": "User ID is required",
                "string.empty": "User ID cannot be empty",
            }),
            deckId: Joi.string().required().messages({
                "any.required": "Deck ID is required",
                "string.empty": "Deck ID cannot be empty",
            })
        }),
        body: Joi.object({
            description: Joi.string().max(500).allow("").optional().messages({
                "string.max": "Description cannot exceed 500 characters"
            })
        }).min(1)
    },

    // DELETE /decks/:deckId - Delete deck
    delete: {
        params: Joi.object({
            userId: Joi.string().required().messages({
                "any.required": "User ID is required",
                "string.empty": "User ID cannot be empty",
            }),
            deckId: Joi.string().required().messages({
                "any.required": "Deck ID is required",
                "string.empty": "Deck ID cannot be empty",
            })
        })
    },

    // GET /decks - List decks with filtering
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