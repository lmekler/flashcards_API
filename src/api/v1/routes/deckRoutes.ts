import express, { Router } from "express";
import { createDeck, getDeck, getAllDecks,
    updateDeck, deleteDeck } from "../controllers/deckController"

const deckRouter: Router = express.Router();

deckRouter.post("/decks", createDeck);

deckRouter.get("/decks/:deckId", getDeck);

deckRouter.get("/decks", getAllDecks);

deckRouter.put("/decks/:deckId", updateDeck);

deckRouter.delete("/decks/:deckId", deleteDeck);

export default deckRouter;