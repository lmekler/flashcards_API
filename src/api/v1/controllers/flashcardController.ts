import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../src/constants/httpConstants";
import { Flashcard } from "../models/flashcardModel";
import { successResponse } from "../models/responseModel";
import { createFlashcardService, getFlashcardService,
    getAllFlashcardsService, updateFlashcardService,
    deleteFlashcardService } from "../services/flashcardService";

export const createFlashcard = async (req: Request, 
    res: Response, next: NextFunction): Promise<void> => 
{
    try 
    {
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

export const getFlashcard = async (req: Request, 
    res: Response, next: NextFunction): Promise<void> =>
{
    try 
    {
        const deckId = req.params.deckId.toString();
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

export const getAllFlashcards = async (req: Request, 
    res: Response, next: NextFunction): Promise<void> => 
{
    try
    {
        const deckId = req.params.deckId.toString();
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

export const updateFlashcard = async (req: Request, 
    res: Response, next: NextFunction): Promise<void> =>
{
    try 
    {
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

export const deleteFlashcard = async (req: Request, 
    res: Response, next: NextFunction): Promise<void> =>
{
    try 
    {
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