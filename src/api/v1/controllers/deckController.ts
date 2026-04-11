// External library imports
import { Request, Response, NextFunction } from "express";

// Internal module imports
import { HTTP_STATUS } from "../../../../src/constants/httpConstants";
import { Deck, DeckData } from "../models/deckModel";
import { successResponse } from "../models/responseModel";
import { createDeckService, getDeckService,
    getAllDecksService, updateDeckService,
    deleteDeckService } from "../services/deckService";

/**
 * Handles creating a new deck.
 * This allows users to create a new deck with a title and description.
 *
 * @param {Request} req - The request object containing deck data.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
export const createDeck = async (req: Request, 
    res: Response, next: NextFunction): Promise<void> => 
{
    try 
    {
        // Create a new deck using the data from the request body
        const 
        { 
            title, 
            description
        } = req.body;

        // const userId = res.locals.uid as string;
        const userId = "testUserId";

        const deckData: DeckData = 
        { 
            title, 
            description,
        };

        const deckResponse: Deck = await createDeckService(userId, deckData);

        res.status(HTTP_STATUS.CREATED).json
        (
            successResponse(deckResponse, "Deck created successfully")
        );
    }
    catch (error: unknown) 
    {
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
export const getDeck = async (req: Request, 
    res: Response, next: NextFunction): Promise<void> =>
{
    try 
    {
        // Retrieve a deck using the ID from the request parameters
        const deckId: string = req.params.deckId.toString();
        const deck = await getDeckService(deckId);
        
        res.status(HTTP_STATUS.OK).json
        (
            successResponse(deck, "Deck retrieved successfully")
        );
    } 
    catch (error: unknown) 
    {
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
export const getAllDecks = async (req: Request, 
    res: Response, next: NextFunction): Promise<void> => 
{
    try
    {
        // Retrieve a list of all decks
        const decks: Deck[] = await getAllDecksService();
        res.status(HTTP_STATUS.OK).json
        (
            successResponse(decks, "Decks retrieved successfully", decks.length)
        );
    }
    catch (error: unknown)
    {
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
export const updateDeck = async (req: Request, 
    res: Response, next: NextFunction): Promise<void> =>
{
    try 
    {
        // Update a deck using the ID from the request 
        // parameters and data from the request body
        const deckId: string = req.params.deckId.toString();
        const {
            description
        }: {
            description: string;
        } = req.body;
        
        const updatedDeck = await updateDeckService(deckId, { description });
        res.status(HTTP_STATUS.OK).json
        (
            successResponse(updatedDeck, "Deck updated successfully")
        );
    } 
    catch (error: unknown) 
    {
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
export const deleteDeck = async (req: Request, 
    res: Response, next: NextFunction): Promise<void> =>
{
    try 
    {
        // Delete a deck using the ID from the request parameters
        const deckId: string = req.params.deckId.toString();
        await deleteDeckService(deckId);
        res.status(HTTP_STATUS.OK).json
        (
            successResponse(null, "Deck deleted successfully")
        );
    } 
    catch (error: unknown) 
    {
        next(error);
    }
};