// Internal module imports
import { HTTP_STATUS } from '../../../constants/httpConstants';
import { AppError } from '../errors/errors';
import { Deck } from '../models/deckModel';
import { createDocument, getDocuments,
    getDocumentById, updateDocument,
    deleteDocument } from "../repositories/firestoreRepository";

// Name of the Firestore collection for decks
const COLLECTION = "decks";

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
        createdAt: new Date().toISOString()
    };

    const id = await createDocument<Deck>(COLLECTION, newDeck);

    return { id, ...newDeck } as Deck;
};

export const getDeckService = async (deckId: string): Promise<Deck | undefined> =>
{
    const doc = await getDocumentById(COLLECTION, deckId);

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

    return deck;
}

export const getAllDecksService = async (userId?: string): Promise<Deck[]> => 
{
    const snapshot = await getDocuments(COLLECTION);

    const decks = snapshot.docs.filter((doc) => 
    {
        const data = doc.data();
        return data.visibility || data.userId === userId;
    }).map((doc) => 
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
    });

    return decks;
};

export const updateDeckService = async (deckId: string, deckData: Partial<Pick<
    Deck, "visibility" | "description">> ): Promise<Deck | undefined> =>
{
    // Check if the deck exists before updating
    await getDeckService(deckId);

    const updateData = {
        ...deckData,
        updatedAt: new Date().toISOString(),
    };

    await updateDocument<Deck>(COLLECTION, deckId, updateData);

    const updatedDeck = await getDeckService(deckId);
    return updatedDeck;
};

export const deleteDeckService = async (deckId: string): Promise<void> =>
{
    // Check if the deck exists before deleting
    await getDeckService(deckId);
    await deleteDocument(COLLECTION, deckId);
}