/**
 * Represents a flashcard in the application.
 * @param id - Unique identifier for the flashcard
 * @param question - The question on the flashcard
 * @param answer - The answer on the flashcard
 * @param isMastered - Whether the user has mastered this flashcard
 * @param createdAt - Timestamp for when the flashcard was created
 * @param updatedAt - Timestamp for last time the flashcard was updated
 */
export interface Flashcard
{
    /** Unique ID for the flashcard */
    id?: string;

    /** The question on the flashcard */
    question: string;

    /** The answer on the flashcard */
    answer: string;

    /** Whether the user has mastered this flashcard */
    isMastered?: boolean;

    /** Timestamp for when the flashcard was created */
    createdAt?: string;

    /** Timestamp for last time the flashcard was updated */
    updatedAt?: string;
}