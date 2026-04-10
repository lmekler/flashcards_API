import express, { Router } from "express";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import { validateRequest } from "../middleware/validate";
import { flashcardSchemas } from "../validation/flashcardSchemas";
import { createFlashcard, getFlashcard, getAllFlashcards,
    updateFlashcard, deleteFlashcard } from "../controllers/flashcardController"

const flashcardRouter: Router = express.Router({ mergeParams: true });

flashcardRouter.post("/", 
    authenticate,
    isAuthorized({ 
        hasRole: ["user"], 
        allowSameUser: true
    }),
    validateRequest(flashcardSchemas.create),
    createFlashcard);

flashcardRouter.get("/:cardId", validateRequest(flashcardSchemas.getById), getFlashcard);

flashcardRouter.get("/", validateRequest(flashcardSchemas.list), getAllFlashcards);

flashcardRouter.put("/:cardId", 
    authenticate,
    isAuthorized({ 
        hasRole: ["user"], 
        allowSameUser: true
    }),
    validateRequest(flashcardSchemas.update),
    updateFlashcard);

flashcardRouter.delete("/:cardId", 
    authenticate,
    isAuthorized({ 
        hasRole: ["user"], 
        allowSameUser: true 
    }),
    validateRequest(flashcardSchemas.delete),
    deleteFlashcard);

export default flashcardRouter;