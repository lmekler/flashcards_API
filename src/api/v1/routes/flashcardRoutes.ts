import express, { Router } from "express";
import { createFlashcard, getFlashcard, getAllFlashcards,
    updateFlashcard, deleteFlashcard } from "../controllers/flashcardController"

const flashcardRouter: Router = express.Router({ mergeParams: true });

flashcardRouter.post("/flashcards", createFlashcard);

flashcardRouter.get("/flashcards/:cardId", getFlashcard);

flashcardRouter.get("/flashcards", getAllFlashcards);

flashcardRouter.put("/flashcards/:cardId", updateFlashcard);

flashcardRouter.delete("/flashcards/:cardId", deleteFlashcard);

export default flashcardRouter;