export interface Deck
{
    id?: string;
    userId: string;
    title: string;
    description?: string;
    cardCount: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface DeckData
{
    title: string;
    description?: string;
}