import express, { Router } from "express";
import { createFlashcard, getFlashcard, getAllFlashcards,
    updateFlashcard, deleteFlashcard } from "../controllers/flashcardController"

const flashcardRouter: Router = express.Router({ mergeParams: true });

flashcardRouter.post("/", createFlashcard);

flashcardRouter.get("/:cardId", getFlashcard);

flashcardRouter.get("/", getAllFlashcards);

flashcardRouter.put("/:cardId", updateFlashcard);

flashcardRouter.delete("/:cardId", deleteFlashcard);

export default flashcardRouter;