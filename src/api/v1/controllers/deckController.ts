import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../src/constants/httpConstants";
import { Deck, DeckData } from "../models/deckModel";
import { successResponse } from "../models/responseModel";
import { createDeckService, getDeckService,
    getAllDecksService, updateDeckService,
    deleteDeckService } from "../services/deckService";

export const createDeck = async (req: Request, 
    res: Response, next: NextFunction): Promise<void> => 
{
    try 
    {
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

export const getDeck = async (req: Request, 
    res: Response, next: NextFunction): Promise<void> =>
{
    try 
    {
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

export const getAllDecks = async (req: Request, 
    res: Response, next: NextFunction): Promise<void> => 
{
    try
    {
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

export const updateDeck = async (req: Request, 
    res: Response, next: NextFunction): Promise<void> =>
{
    try 
    {
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

export const deleteDeck = async (req: Request, 
    res: Response, next: NextFunction): Promise<void> =>
{
    try 
    {
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