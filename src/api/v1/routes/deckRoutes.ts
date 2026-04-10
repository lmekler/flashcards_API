import express, { Router } from "express";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import cardRouter from "./flashcardRoutes";
import { validateRequest } from "../middleware/validate";
import { deckSchemas } from "../validation/deckSchemas";
import { createDeck, getDeck, getAllDecks,
    updateDeck, deleteDeck } from "../controllers/deckController"

const deckRouter: Router = express.Router();

deckRouter.post("/", 
    authenticate,
  isAuthorized({ hasRole: ["user"] }),
  validateRequest(deckSchemas.create),
  createDeck);

deckRouter.get("/:deckId", validateRequest(deckSchemas.getById), getDeck);

deckRouter.get("/", validateRequest(deckSchemas.list), getAllDecks);

deckRouter.put("/:deckId", 
    authenticate,
    isAuthorized({ 
        hasRole: ["user"], 
        allowSameUser: true
    }),
    validateRequest(deckSchemas.update),
    updateDeck);

deckRouter.delete("/:deckId", 
    authenticate,
    isAuthorized({ 
        hasRole: ["user"], 
        allowSameUser: true 
    }),
    validateRequest(deckSchemas.delete),
    deleteDeck);

// Mount cardRouter under deckRouter
deckRouter.use('/:deckId/flashcards', cardRouter);

export default deckRouter;