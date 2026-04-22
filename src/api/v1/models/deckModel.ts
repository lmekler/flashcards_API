/**
 * Represents a deck in the application.
 * @param id - Unique identifier for the deck
 * @param userId - The user who owns the deck
 * @param visibility - Whether the deck is private or public
 * @param title - The title of the deck
 * @param description - The description of the deck
 * @param cardCount - The number of flashcards in the deck
 * @param createdAt - Timestamp for when the deck was created
 * @param updatedAt - Timestamp for last time the deck was updated
 */
export interface Deck
{
    /** Unique ID for the deck */
    id?: string;

    /** ID of the user who owns the deck */
    userId: string;

    /** Whether the deck is private or public */
    visibility: boolean;

    /** Title of the deck */
    title: string;

    /** Description of the deck */
    description?: string;

    /** Number of flashcards in the deck */
    cardCount: number;

    /** Timestamp for when the deck was created */
    createdAt?: string;

    /** Timestamp for last time the deck was updated */
    updatedAt?: string;
}

/**
 * Represents a deck data request body.
 * @param visibility - Whether the deck is private or public
 * @param title - The title of the deck
 * @param description - A brief description of the deck
 */
export interface DeckData
{
    /** Whether the deck is private or public */
    visibility: boolean;

    /** Title of the deck */
    title: string;

    /** Description of the deck */
    description?: string;
}