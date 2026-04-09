export interface Flashcard
{
    id?: string;
    question: string;
    answer: string;
    isMastered?: boolean;
    createdAt?: string;
    updatedAt?: string;
}