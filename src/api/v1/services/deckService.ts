// Internal module imports
import { HTTP_STATUS } from '../../../constants/httpConstants';
import { COLLECTION } from '../../../constants/firestoreCollections';
import { AppError } from '../errors/errors';
import { Deck } from '../models/deckModel';
import { canView, canModify, canDelete } from '../utils/permissions';
import { createDocument, getDocuments,
    getDocumentById, updateDocument,
    deleteDocument } from "../repositories/firestoreRepository";

export const createDeckService = async (
    userId: string,
    deckData: {
        visibility?: boolean;
        title: string;
        description?: string;
    }): Promise<Deck> => 
{
    // Create a new deck with input data, an initial card
    // count of 0, and public access by default
    const newDeck: Deck =
    {
        userId: userId,
        visibility: deckData.visibility ?? true,
        title: deckData.title,
        description: deckData.description ?? '',
        cardCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const id = await createDocument<Deck>(COLLECTION.DECK, newDeck);

    return { id, ...newDeck } as Deck;
};

// Finds a deck by ID and returns it with no access control
export const findDeckById = async (deckId: string): Promise<Deck> => 
{
    const doc = await getDocumentById(COLLECTION.DECK, deckId);

    if (!doc) 
    {
        throw new AppError(
            `Deck with ID ${deckId} not found`,
            'DECK_NOT_FOUND', 
            HTTP_STATUS.NOT_FOUND
        );
    }

    const data = doc.data();

    const deck: Deck = {
        id: doc.id,
        userId: data?.userId,
        visibility: data?.visibility,
        title: data?.title,
        description: data?.description,
        cardCount: data?.cardCount,
        createdAt: data?.createdAt,
        updatedAt: data?.updatedAt
    } as Deck;
    
    return deck
};

export const getDeckService = async (
    deckId: string,
    user?: {
        role: string;
        uid: string;
    }): Promise<Deck> =>
{
    const deck: Deck= await findDeckById(deckId);

    // Reject access to the deck if it is private, does not belong to the user,
    // and the user does not have a privileged role
    if (!canView(deck, user)) 
    {
        throw new AppError(
            'You do not have permission to access this deck', 
            'FORBIDDEN',
            HTTP_STATUS.FORBIDDEN
        );
    }

    return deck;
}

export const getAllDecksService = async (
    user?: { 
        role: string; 
        uid: string
    }): Promise<Deck[]> => 
{
    const snapshot = await getDocuments(COLLECTION.DECK);

    const decks: Deck[] = snapshot.docs.map((doc) => 
    {
        const data = doc.data();
        return {
            id: doc.id,
            userId: data.userId,
            visibility: data.visibility,
            cardCount: data.cardCount,
            title: data.title,
            description: data.description,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        } as Deck;
    }).filter((deck) =>
        // Filter list of decks by whether or not the current user
        // has permission to view the deck
        canView(deck, user)
    )

    return decks;
};

export const updateDeckService = async (
    deckId: string, 
    deckData: Partial<Pick<Deck, "visibility" | "description">>,
    user?: {
        role: string;
        uid: string;
    }): Promise<Deck> =>
{
    // Check if the deck exists
    const deck: Deck = await findDeckById(deckId);

    // Reject modification to the deck if it does not belong to the user
    if (!canModify(deck, user)) 
    {
        throw new AppError(
            'You do not have permission to modify this deck', 
            'FORBIDDEN',
            HTTP_STATUS.FORBIDDEN
        );
    }

    const updateData = {
        ...deckData,
        updatedAt: new Date().toISOString(),
    };

    await updateDocument<Deck>(COLLECTION.DECK, deckId, updateData);

    const updatedDeck: Deck = await getDeckService(deckId, user);
    return updatedDeck;
};

export const deleteDeckService = async (
    deckId: string,
    user?: {
        role: string;
        uid: string;
    }): Promise<void> =>
{
    // Check if the deck exists
    const deck: Deck = await findDeckById(deckId);

    // Reject deletion of the deck if it does not belong to the user,
    // and the user does not have a privileged role
    if (!canDelete(deck, user)) 
    {
        throw new AppError(
            'You do not have permission to delete this deck', 
            'FORBIDDEN',
            HTTP_STATUS.FORBIDDEN
        );
    }
    await deleteDocument(COLLECTION.DECK, deckId);
}