import express, { Router } from "express";
import cardRouter from "./flashcardRoutes";
import { createDeck, getDeck, getAllDecks,
    updateDeck, deleteDeck } from "../controllers/deckController"

const deckRouter: Router = express.Router();

deckRouter.post("/decks", createDeck);

deckRouter.get("/decks/:deckId", getDeck);

deckRouter.get("/decks", getAllDecks);

deckRouter.put("/decks/:deckId", updateDeck);

deckRouter.delete("/decks/:deckId", deleteDeck);

// Mount cardRouter under deckRouter
deckRouter.use('/:deckId', cardRouter);

export default deckRouter;