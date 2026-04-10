import express, { Router } from "express";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import { createFlashcard, getFlashcard, getAllFlashcards,
    updateFlashcard, deleteFlashcard } from "../controllers/flashcardController"

const flashcardRouter: Router = express.Router({ mergeParams: true });

flashcardRouter.post("/", 
    authenticate,
    isAuthorized({ 
        hasRole: ["user"], 
        allowSameUser: true
    }),
    createFlashcard);

flashcardRouter.get("/:cardId", getFlashcard);

flashcardRouter.get("/", getAllFlashcards);

flashcardRouter.put("/:cardId", 
    authenticate,
    isAuthorized({ 
        hasRole: ["user"], 
        allowSameUser: true
    }),
    updateFlashcard);

flashcardRouter.delete("/:cardId", 
    authenticate,
    isAuthorized({ 
        hasRole: ["user"], 
        allowSameUser: true 
    }),
    deleteFlashcard);

export default flashcardRouter;