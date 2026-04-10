import express, { Router } from "express";
import cardRouter from "./flashcardRoutes";
import { createDeck, getDeck, getAllDecks,
    updateDeck, deleteDeck } from "../controllers/deckController"

const deckRouter: Router = express.Router();

deckRouter.post("/", createDeck);

deckRouter.get("/:deckId", getDeck);

deckRouter.get("/", getAllDecks);

deckRouter.put("/:deckId", updateDeck);

deckRouter.delete("/:deckId", deleteDeck);

// Mount cardRouter under deckRouter
deckRouter.use('/:deckId/flashcards', cardRouter);

export default deckRouter;