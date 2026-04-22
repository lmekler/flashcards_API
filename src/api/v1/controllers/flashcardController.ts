// External library imports
import { Request, Response, NextFunction } from "express";

// Internal module imports
import { AppError } from "../errors/errors";
import { HTTP_STATUS } from "../../../../src/constants/httpConstants";
import { Flashcard } from "../models/flashcardModel";
import { successResponse } from "../models/responseModel";
import { getDeckService } from "../services/deckService";
import { createFlashcardService, getFlashcardService,
    getAllFlashcardsService, updateFlashcardService,
    deleteFlashcardService } from "../services/flashcardService";

/**
 * Handles creating a new flashcard.
 * This allows users to create a new flashcard within a specific deck.
 *
 * @param {Request} req - The request object containing flashcard data.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
export const createFlashcard = async (req: Request, 
    res: Response, next: NextFunction): Promise<void> => 
{
    try 
    {
        // Create a new flashcard using deck ID and input data
        const 
        { 
            question,
            answer,
            isMastered
        } = req.body;

        const deckId = req.params.deckId.toString();

        const flashcardData: Flashcard = 
        { 
            question,
            answer,
            isMastered
        };

        const flashcardResponse: Flashcard = await createFlashcardService(deckId, flashcardData);

        res.status(HTTP_STATUS.CREATED).json
        (
            successResponse(flashcardResponse, "Flashcard created successfully")
        );
    }
    catch (error: unknown) 
    {
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
export const getFlashcard = async (req: Request, 
    res: Response, next: NextFunction): Promise<void> =>
{
    try 
    {
        // retrieve deck using the deck ID
        const deckId = req.params.deckId.toString();
        const deck = await getDeckService(deckId);

        // reject access to the deck if it is private and does not belong to the user
        if (!deck?.visibility && deck?.userId !== res.locals.uid) 
        {
            throw new AppError(
                'You do not have permission to access this deck', 
                'FORBIDDEN',
                HTTP_STATUS.FORBIDDEN
            );
        }

        // Retrieve a flashcard using the flashcard ID
        const cardId: string = req.params.cardId.toString();
        const flashcard = await getFlashcardService(deckId, cardId);
        
        res.status(HTTP_STATUS.OK).json
        (
            successResponse(flashcard, "Flashcard retrieved successfully")
        );
    } 
    catch (error: unknown) 
    {
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
export const getAllFlashcards = async (req: Request, 
    res: Response, next: NextFunction): Promise<void> => 
{
    try
    {
        // retrieve deck using the deck ID
        const deckId = req.params.deckId.toString();
        const deck = await getDeckService(deckId);

        // reject access to the deck if it is private and does not belong to the user
        if (!deck?.visibility && deck?.userId !== res.locals.uid) 
        {
            throw new AppError(
                'You do not have permission to access this deck', 
                'FORBIDDEN',
                HTTP_STATUS.FORBIDDEN
            );
        }
                
        // Retrieve a list of all the flashcards within the deck
        const flashcards: Flashcard[] = await getAllFlashcardsService(deckId);
        res.status(HTTP_STATUS.OK).json
        (
            successResponse(flashcards, "Flashcards retrieved successfully", flashcards.length)
        );
    }
    catch (error: unknown)
    {
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
export const updateFlashcard = async (req: Request, 
    res: Response, next: NextFunction): Promise<void> =>
{
    try 
    {
        // Update a flashcard using the deck ID and flashcard ID with input data
        const deckId = req.params.deckId.toString();
        const cardId: string = req.params.cardId.toString();
        const {
            isMastered
        }: {
            isMastered: boolean;
        } = req.body;
        
        const updatedFlashcard = await updateFlashcardService(deckId, cardId, { isMastered });
        res.status(HTTP_STATUS.OK).json
        (
            successResponse(updatedFlashcard, "Flashcard updated successfully")
        );
    } 
    catch (error: unknown) 
    {
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
export const deleteFlashcard = async (req: Request, 
    res: Response, next: NextFunction): Promise<void> =>
{
    try 
    {
        // Delete a flashcard using the deck ID and flashcard ID
        const deckId = req.params.deckId.toString();
        const cardId: string = req.params.cardId.toString();
        await deleteFlashcardService(deckId, cardId);
        res.status(HTTP_STATUS.OK).json
        (
            successResponse(null, "Flashcard deleted successfully")
        );
    } 
    catch (error: unknown) 
    {
        next(error);
    }
};