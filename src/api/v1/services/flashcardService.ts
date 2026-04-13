import { HTTP_STATUS } from '../../../constants/httpConstants';
import { AppError } from '../errors/errors';
import { Flashcard } from '../models/flashcardModel';
import { createDocument, getDocuments,
    getDocumentById, updateDocument,
    deleteDocument } from "../repositories/firestoreRepository";

// Name of the Firestore collection for flashcards
const COLLECTION = "flashcards";

export const createFlashcardService = async (
    deckId: string,
    flashcardData: {
        question: string;
        answer: string;
        isMastered?: boolean;
    }): Promise<Flashcard> => 
{
    try 
    {
        // create a new flashcard with the provided data and 
        // an initial isMastered value of false if not provided
        const newFlashcard: Flashcard =
        {
            question: flashcardData.question,
            answer: flashcardData.answer,
            isMastered: flashcardData.isMastered ?? false,
            createdAt: new Date().toISOString()
        };

        const id = await createDocument(`decks/${deckId}/flashcards`, newFlashcard);

        return { id, ...newFlashcard } as Flashcard;
    } 
    catch (error: unknown) 
    {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to create flashcard: ${errorMessage}`);
    }
};

export const getFlashcardService = async (deckId: string, 
    cardId: string): Promise<Flashcard | undefined> =>
{
    try 
    {
        const doc = await getDocumentById(`decks/${deckId}/flashcards`, cardId);

        if (!doc) 
        {
            throw new Error(`Flashcard with ID ${cardId} not found`);
        }

        const data = doc.data();

        const flashcard: Flashcard = {
            id: doc.id,
            question: data?.question,
            answer: data?.answer,
            isMastered: data?.isMastered,
            createdAt: data?.createdAt,
            updatedAt: data?.updatedAt
        } as Flashcard;

        return flashcard;
    } 
    catch (error: unknown) 
    {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to retrieve the flashcard: ${errorMessage}`);
    }
}

export const getAllFlashcardsService = async (deckId: string): Promise<Flashcard[]> => 
{
    try 
    {
        const snapshot = await getDocuments(`decks/${deckId}/flashcards`);

        const flashcards = snapshot.docs.map((doc) => 
        {
            const data = doc.data();
            return {
                id: doc.id,
                question: data.question,
                answer: data.answer,
                isMastered: data.isMastered,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt
            } as Flashcard;
        });
        return flashcards;
    } 
    catch (error: unknown)
    {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to retrieve all flashcards: ${errorMessage}`);
    }
};

export const updateFlashcardService = async (deckId: string, cardId: string, flashcardData:
    { isMastered: boolean }): Promise<Flashcard | undefined>  => 
{
    try 
    {
        const doc = await updateDocument(`decks/${deckId}/flashcards`, cardId, flashcardData);

        // Return the updated flashcard
        const updatedFlashcard = await getFlashcardService(deckId, cardId);
        updatedFlashcard!.updatedAt = new Date().toISOString();
        return updatedFlashcard;
    } 
    catch (error: unknown)
    {
        const errorMessage =error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to update flashcard ${cardId}: ${errorMessage}`);
    }
};

export const deleteFlashcardService = async (deckId: string, cardId: string): Promise<void> =>
{
    try 
    {
        // Check if flashcard exists before deleting
        const flashcard = await getFlashcardService(deckId, cardId);
        if (!flashcard) 
        {
            throw new Error(`Flashcard with ID ${cardId} not found`);
        }

        await deleteDocument(`decks/${deckId}/flashcards`, cardId);
    } 
    catch (error: unknown)
    {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to delete the flashcard: ${errorMessage}`);
    }
}