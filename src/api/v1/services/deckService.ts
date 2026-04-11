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
    try 
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
    } 
    catch (error: unknown) 
    {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to create deck: ${errorMessage}`);
    }
};

export const getDeckService = async (id: string): Promise<Deck | undefined> =>
{
    try 
    {
        const doc = await getDocumentById(COLLECTION, id);

        if (!doc) 
        {
            throw new Error(`Deck with ID ${id} not found`);
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
    catch (error: unknown) 
    {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to retrieve the deck: ${errorMessage}`);
    }
}

export const getAllDecksService = async (): Promise<Deck[]> => 
{
    try 
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
    } 
    catch (error: unknown)
    {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to retrieve all decks: ${errorMessage}`);
    }
};

export const updateDeckService = async (id: string, deckData: 
    { description: string }): Promise<Deck | undefined>  => 
{
    try 
    {
        await updateDocument<Deck>(COLLECTION, id, deckData);

        // Return the updated deck
        const updatedDeck = await getDeckService(id);
        updatedDeck!.updatedAt = new Date().toISOString();
        return updatedDeck;
    } 
    catch (error: unknown)
    {
        const errorMessage =error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to update deck ${id}: ${errorMessage}`);
    }
};

export const deleteDeckService = async (id: string): Promise<void> =>
{
    try 
    {
        // Check if deck exists before deleting
        const deck = await getDeckService(id);
        if (!deck) 
        {
            throw new Error(`Deck with ID ${id} not found`);
        }

        await deleteDocument(COLLECTION, id);
    } 
    catch (error: unknown)
    {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to delete the deck: ${errorMessage}`);
    }
}