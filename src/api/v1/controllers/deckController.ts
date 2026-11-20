// External library imports
import { Request, Response, NextFunction } from "express";

// Internal module imports
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { Deck } from "../models/deckModel";
import { successResponse } from "../models/responseModel";
import {
  createDeckService,
  getDeckService,
  getAllDecksService,
  updateDeckService,
  deleteDeckService,
} from "../services/deckService";

/**
 * Handles creating a new deck.
 * This allows users to create a new deck with a title and description.
 *
 * @param {Request} req - The request object containing deck data.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
export const createDeck = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = res.locals.uid as string;
    const deckData = req.body;

    const deck: Deck = await createDeckService(userId, deckData);

    res
      .status(HTTP_STATUS.CREATED)
      .json(successResponse(deck, "Deck created successfully"));
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Handles getting a single deck by ID.
 * This allows users to retrieve the details of a specific deck.
 *
 * @param {Request} req - The request object containing deck data.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
export const getDeck = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const deckId: string = req.params.deckId.toString();
    const { role, uid } = res.locals;

    const deck = await getDeckService(deckId, { role, uid });

    res
      .status(HTTP_STATUS.OK)
      .json(successResponse(deck, "Deck retrieved successfully"));
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Handles getting all decks.
 * This allows users to retrieve the details of all decks.
 *
 * @param {Request} req - The request object containing deck data.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
export const getAllDecks = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { role, uid } = res.locals;

    const decks: Deck[] = await getAllDecksService({ role, uid });

    res
      .status(HTTP_STATUS.OK)
      .json(
        successResponse(decks, "Decks retrieved successfully", decks.length),
      );
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Handles updating a deck by ID.
 * This allows users to update the details of a specific deck.
 *
 * @param {Request} req - The request object containing deck data.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
export const updateDeck = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const deckId: string = req.params.deckId.toString();
    const updateData = req.body;
    const { role, uid } = res.locals;

    const updatedDeck = await updateDeckService(deckId, updateData, {
      role,
      uid,
    });

    res
      .status(HTTP_STATUS.OK)
      .json(successResponse(updatedDeck, "Deck updated successfully"));
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Handles deleting a deck by ID.
 * This allows users to delete a specific deck.
 *
 * @param {Request} req - The request object containing deck data.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
export const deleteDeck = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const deckId: string = req.params.deckId.toString();
    const { role, uid } = res.locals;

    await deleteDeckService(deckId, { role, uid });

    res
      .status(HTTP_STATUS.OK)
      .json(successResponse(null, "Deck deleted successfully"));
  } catch (error: unknown) {
    next(error);
  }
};
