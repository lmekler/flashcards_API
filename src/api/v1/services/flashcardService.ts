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
};

export const getFlashcardService = async (deckId: string, 
    cardId: string): Promise<Flashcard | undefined> =>
{
    const doc = await getDocumentById(`decks/${deckId}/flashcards`, cardId);

    if (!doc) 
    {
        throw new AppError(
            `Flashcard with ID ${cardId} not found`,
            'FLASHCARD_NOT_FOUND', 
            HTTP_STATUS.NOT_FOUND
        );
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

export const getAllFlashcardsService = async (deckId: string): Promise<Flashcard[]> => 
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
};

export const updateFlashcardService = async (deckId: string, cardId: string, flashcardData:
    { isMastered: boolean }): Promise<Flashcard | undefined>  => 
{
    // Check if flashcard exists before updating
    await getFlashcardService(deckId, cardId);
    await updateDocument(`decks/${deckId}/flashcards`, cardId, flashcardData);

    // Return the updated flashcard
    const updatedFlashcard = await getFlashcardService(deckId, cardId);
    updatedFlashcard!.updatedAt = new Date().toISOString();
    return updatedFlashcard;
};

export const deleteFlashcardService = async (deckId: string, cardId: string): Promise<void> =>
{
    // Check if flashcard exists before deleting
    await getFlashcardService(deckId, cardId);
    await deleteDocument(`decks/${deckId}/flashcards`, cardId);
}