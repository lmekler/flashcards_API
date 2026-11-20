// External library imports
import { Request, Response, NextFunction } from "express";

// Internal module imports
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { Flashcard } from "../models/flashcardModel";
import { successResponse } from "../models/responseModel";
import {
  createFlashcardService,
  getFlashcardService,
  getAllFlashcardsService,
  updateFlashcardService,
  deleteFlashcardService,
} from "../services/flashcardService";

/**
 * Handles creating a new flashcard.
 * This allows users to create a new flashcard within a specific deck.
 *
 * @param {Request} req - The request object containing flashcard data.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
export const createFlashcard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const deckId = req.params.deckId.toString();
    const flashcardData = req.body;
    const { role, uid } = res.locals;

    const flashcardResponse: Flashcard = await createFlashcardService(
      deckId,
      flashcardData,
      { role, uid },
    );

    res
      .status(HTTP_STATUS.CREATED)
      .json(
        successResponse(flashcardResponse, "Flashcard created successfully"),
      );
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Handles getting a single flashcard by ID.
 * This allows users to retrieve the details of a specific flashcard.
 *
 * @param {Request} req - The request object containing flashcard data.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
export const getFlashcard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const deckId: string = req.params.deckId.toString();
    const cardId: string = req.params.cardId.toString();
    const { role, uid } = res.locals;

    const flashcard = await getFlashcardService(deckId, cardId, { role, uid });

    res
      .status(HTTP_STATUS.OK)
      .json(successResponse(flashcard, "Flashcard retrieved successfully"));
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Handles getting all flashcards for a specific deck.
 * This allows users to retrieve the details of all flashcards within a specific deck.
 *
 * @param {Request} req - The request object containing flashcard data.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
export const getAllFlashcards = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const deckId: string = req.params.deckId.toString();
    const { role, uid } = res.locals;

    const flashcards: Flashcard[] = await getAllFlashcardsService(deckId, {
      role,
      uid,
    });

    res
      .status(HTTP_STATUS.OK)
      .json(
        successResponse(
          flashcards,
          "Flashcards retrieved successfully",
          flashcards.length,
        ),
      );
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Handles updating a flashcard by ID.
 * This allows users to update the details of a specific flashcard.
 *
 * @param {Request} req - The request object containing flashcard data.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
export const updateFlashcard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const deckId = req.params.deckId.toString();
    const cardId: string = req.params.cardId.toString();
    const updateData = req.body;
    const { role, uid } = res.locals;

    const updatedFlashcard = await updateFlashcardService(
      deckId,
      cardId,
      updateData,
      { role, uid },
    );

    res
      .status(HTTP_STATUS.OK)
      .json(
        successResponse(updatedFlashcard, "Flashcard updated successfully"),
      );
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Handles deleting a flashcard by ID.
 * This allows users to delete a specific flashcard.
 *
 * @param {Request} req - The request object containing flashcard data.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
export const deleteFlashcard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const deckId = req.params.deckId.toString();
    const cardId: string = req.params.cardId.toString();
    const { role, uid } = res.locals;

    await deleteFlashcardService(deckId, cardId, { role, uid });

    res
      .status(HTTP_STATUS.OK)
      .json(successResponse(null, "Flashcard deleted successfully"));
  } catch (error: unknown) {
    next(error);
  }
};
