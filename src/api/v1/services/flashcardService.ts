// Internal module imports
import { HTTP_STATUS } from '../../../constants/httpConstants';
import { AppError } from '../errors/errors';
import { Flashcard } from '../models/flashcardModel';
import { findDeckById } from "./deckService";
import { canView, canModify, canDelete } from '../utils/permissions';
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
    },
    user?: {
        role: string;
        uid: string;
    }): Promise<Flashcard> => 
{
    // Check if the deck exists
    const deck = await findDeckById(deckId);

    // Reject modification to the deck if it does not belong to the user
    if (!canModify(deck, user)) 
    {
        throw new AppError(
            'You do not have permission to modify this deck', 
            'FORBIDDEN',
            HTTP_STATUS.FORBIDDEN
        );
    }

    // Create a new flashcard with input data and
    // unmastered status by default
    const newFlashcard: Flashcard =
    {
        question: flashcardData.question,
        answer: flashcardData.answer,
        isMastered: flashcardData.isMastered ?? false,
        createdAt: new Date().toISOString()
    };

    const id = await createDocument(`decks/${deckId}/flashcards`, newFlashcard);

    // Update the card count in the deck any time a flashcard is created
    const cardCount = (await getAllFlashcardsService(deckId, user)).length;
    await updateDocument(`decks`, deckId, 
    { 
        cardCount: cardCount
    });

    return { id, ...newFlashcard } as Flashcard;
};

export const getFlashcardService = async (
    deckId: string, 
    cardId: string,
    user?: {
        role: string;
        uid: string;
    }): Promise<Flashcard | undefined> =>
{
    // Check if the deck exists
    const deck = await findDeckById(deckId);

    // Reject access to the flashcard if the deck is private, does not belong to the user,
    // and the user does not have a privileged role
    if (!canView(deck, user)) 
    {
        throw new AppError(
            'You do not have permission to view flashcards in this deck', 
            'FORBIDDEN',
            HTTP_STATUS.FORBIDDEN
        );
    }
    
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

export const getAllFlashcardsService = async (
        deckId: string,
        user?: {
            role: string;
            uid: string;
        }): Promise<Flashcard[]> => 
{
    // Check if the deck exists
    const deck = await findDeckById(deckId);

    // Reject access to the flashcard if the deck is private, does not belong to the user,
    // and the user does not have a privileged role
    if (!canView(deck, user)) 
    {
        throw new AppError(
            'You do not have permission to view flashcards in this deck', 
            'FORBIDDEN',
            HTTP_STATUS.FORBIDDEN
        );
    }

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

export const updateFlashcardService = async (
    deckId: string, 
    cardId: string, 
    updateData: { 
        isMastered: boolean 
    },
    user?: {
        role: string;
        uid: string;
    }): Promise<Flashcard | undefined>  => 
{
    // Check if the deck exists
    const deck = await findDeckById(deckId);

    // Check if the flashcard exists
    await getFlashcardService(deckId, cardId, user);

    // Reject modification of the flashcard if the deck does not belong to the user
    if (!canModify(deck, user)) 
    {
        throw new AppError(
            'You do not have permission to modify flashcards in this deck', 
            'FORBIDDEN',
            HTTP_STATUS.FORBIDDEN
        );
    }

    await updateDocument(`decks/${deckId}/flashcards`, cardId, updateData);

    const updatedFlashcard = await getFlashcardService(deckId, cardId, user);
    updatedFlashcard!.updatedAt = new Date().toISOString();
    return updatedFlashcard;
};

export const deleteFlashcardService = async (
    deckId: string, 
    cardId: string,
    user?: {
        role: string,
        uid: string;
    }): Promise<void> =>
{
    // Check if the deck exists
    const deck = await findDeckById(deckId);

    // Check if the flashcard exists
    await getFlashcardService(deckId, cardId, user);

    // Reject deletion of the flashcard if the deck does not belong to the user,
    // and the user does not have a privileged role
    if (!canDelete(deck, user)) 
    {
        throw new AppError(
            'You do not have permission to delete flashcards in this deck', 
            'FORBIDDEN',
            HTTP_STATUS.FORBIDDEN
        );
    }

    await deleteDocument(`decks/${deckId}/flashcards`, cardId);

    // Update the card count in the deck any time a flashcard is deleted
    const cardCount = (await getAllFlashcardsService(deckId, user)).length;
    await updateDocument(`decks`, deckId, 
    { 
        cardCount: cardCount
    });
}