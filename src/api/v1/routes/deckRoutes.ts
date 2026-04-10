import express, { Router } from "express";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import cardRouter from "./flashcardRoutes";
import { createDeck, getDeck, getAllDecks,
    updateDeck, deleteDeck } from "../controllers/deckController"

const deckRouter: Router = express.Router();

deckRouter.post("/", 
    authenticate,
  isAuthorized({ hasRole: ["user"] }),
  createDeck);

deckRouter.get("/:deckId", getDeck);

deckRouter.get("/", getAllDecks);

deckRouter.put("/:deckId", 
    authenticate,
    isAuthorized({ 
        hasRole: ["user"], 
        allowSameUser: true
    }),
    updateDeck);

deckRouter.delete("/:deckId", 
    authenticate,
    isAuthorized({ 
        hasRole: ["user"], 
        allowSameUser: true 
    }),
    deleteDeck);

// Mount cardRouter under deckRouter
deckRouter.use('/:deckId/flashcards', cardRouter);

export default deckRouter;