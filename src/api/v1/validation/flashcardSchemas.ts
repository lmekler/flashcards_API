import Joi, { ObjectSchema } from "joi";

// Flashcard operation schemas organized by request part
export const flashcardSchemas = {
    // POST /flashcards - Create new flashcard
    create: {
        params: Joi.object({
            deckId: Joi.string().required().messages({
                "any.required": "Deck ID is required",
                "string.empty": "Deck ID cannot be empty",
            })
        }),
        body: Joi.object({
            question: Joi.string().min(1).max(500).required(),
            answer: Joi.string().trim().min(1).max(1000).required(),
            isMastered: Joi.boolean().optional().default(false)
        })
    },

    // GET /flashcards/:cardId - Get single flashcard
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

    // GET /flashcards - List flashcards with filtering
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

    // PUT /flashcards/:cardId - Update flashcard
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
            isMastered: Joi.boolean().optional().default(false)
        }).min(1)
    },

    // DELETE /flashcards/:cardId - Delete flashcard
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