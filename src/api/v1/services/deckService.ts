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
        title: string;
        description?: string;
    }): Promise<Deck> => 
{
    // create a new deck with the provided data and an initial card count of 0
    const newDeck: Deck =
    {
        userId: userId,
        title: deckData.title,
        description: deckData.description ?? '',
        cardCount: 0,
        createdAt: new Date().toISOString()
    };

    const id = await createDocument<Deck>(COLLECTION, newDeck);

    return { id, ...newDeck } as Deck;
};

export const getDeckService = async (id: string): Promise<Deck | undefined> =>
{
    const doc = await getDocumentById(COLLECTION, id);

    if (!doc) 
    {
        throw new AppError(
            `Deck with ID ${id} not found`,
            'DECK_NOT_FOUND', 
            HTTP_STATUS.NOT_FOUND
        );
    }

    const data = doc.data();

    const deck: Deck = {
        id: doc.id,
        userId: data?.userId,
        title: data?.title,
        description: data?.description,
        cardCount: data?.cardCount,
        createdAt: data?.createdAt,
        updatedAt: data?.updatedAt
    } as Deck;

    return deck;
}

export const getAllDecksService = async (): Promise<Deck[]> => 
{
    const snapshot = await getDocuments(COLLECTION);

    const decks = snapshot.docs.map((doc) => 
    {
        const data = doc.data();
        return {
            id: doc.id,
            userId: data.userId,
            cardCount: data.cardCount,
            title: data.title,
            description: data.description,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        } as Deck;
    });

    return decks;
};

export const updateDeckService = async (id: string, deckData: 
    { description: string }): Promise<Deck | undefined>  => 
{
    // Check if deck exists before updating
    await getDeckService(id);
    await updateDocument<Deck>(COLLECTION, id, deckData);

    // Return the updated deck
    const updatedDeck = await getDeckService(id);
    updatedDeck!.updatedAt = new Date().toISOString();
    return updatedDeck;
};

export const deleteDeckService = async (id: string): Promise<void> =>
{
    // Check if deck exists before deleting
    await getDeckService(id);
    await deleteDocument(COLLECTION, id);
}