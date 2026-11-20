// Internal module imports
import { HTTP_STATUS } from '../../../constants/httpConstants';
import { COLLECTION } from '../../../constants/firestoreCollections';
import { AppError } from '../errors/errors';
import { Flashcard } from '../models/flashcardModel';
import { Deck } from '../models/deckModel';
import { findDeckById } from "./deckService";
import { canView, canModify, canDelete } from '../utils/permissions';
import { createDocument, createNestedDocument, getDocuments, getNestedDocuments,
    getDocumentById, getNestedDocumentById, updateDocument, updateNestedDocument,
    deleteDocument } from "../repositories/firestoreRepository";

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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    // const id = await createDocument<Flashcard>(COLLECTION.FLASHCARD, newFlashcard);

    const id = await createNestedDocument<Flashcard>(
    COLLECTION.DECK,
    deckId,
    COLLECTION.FLASHCARD,
    newFlashcard
);

    // Update the card count in the deck any time a flashcard is created
    const cardCount = (await getAllFlashcardsService(deckId, user)).length;
    await updateDocument(`decks`, deckId, 
    { 
        cardCount: cardCount
    });

    return { id, ...newFlashcard } as Flashcard;
};


const findFlashcardById = async (deckId: string, cardId: string): Promise<Flashcard> =>
{
    // const doc = await getDocumentById(COLLECTION.FLASHCARD, cardId);
    const doc = await getNestedDocumentById(
        COLLECTION.DECK,
        deckId,
        COLLECTION.FLASHCARD,
        cardId
    );

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

    // Retrieve the flashcard
    const flashcard = await findFlashcardById(deckId, cardId);

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

    // const snapshot = await getDocuments(COLLECTION.FLASHCARD);

    const snapshot = await getNestedDocuments(
        COLLECTION.DECK,
        deckId,
        COLLECTION.FLASHCARD
    );

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
    flashcardData: { 
        isMastered: boolean 
    },
    user?: {
        role: string;
        uid: string;
    }): Promise<Flashcard | undefined>  => 
{
    // Check if the deck exists
    const deck = await findDeckById(deckId);

    // Reject modification of the flashcard if the deck does not belong to the user
    if (!canModify(deck, user)) 
    {
        throw new AppError(
            'You do not have permission to modify flashcards in this deck', 
            'FORBIDDEN',
            HTTP_STATUS.FORBIDDEN
        );
    }

    // Check if the flashcard exists
    await findFlashcardById(deckId, cardId);

    const updateData = {
        ...flashcardData,
        updatedAt: new Date().toISOString(),
    };
    
    // await updateDocument<Flashcard>(COLLECTION.FLASHCARD, cardId, updateData);
    await updateNestedDocument<Flashcard>(
        COLLECTION.DECK,
        deckId,
        COLLECTION.FLASHCARD,
        cardId,
        updateData
    );

    const updatedFlashcard = await findFlashcardById(deckId, cardId);
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

    // Check if the flashcard exists
    await findFlashcardById(deckId, cardId);

    await deleteDocument(COLLECTION.FLASHCARD, cardId);

    // Update the card count in the deck any time a flashcard is deleted
    const cardCount = (await getAllFlashcardsService(deckId, user)).length;

    const updateData = {
        ...deck,
        cardCount: cardCount,
        updatedAt: new Date().toISOString(),
    };
    
    await updateDocument<Deck>(COLLECTION.DECK, deckId, updateData);
}