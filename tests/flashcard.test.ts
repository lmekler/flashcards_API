// Internal module imports
import { AppError } from '../src/api/v1/errors/errors';
import { HTTP_STATUS } from '../src/constants/httpConstants';
import * as firestoreRepository from '../src/api/v1/repositories/firestoreRepository';
import * as flashcardService from '../src/api/v1/services/flashcardService';
import { Flashcard } from '../src/api/v1/models/flashcardModel';

// Mock the firebase configuration
jest.mock('../src/config/firebaseConfig', () => ({ db: {} }));

// Mock the repository module
jest.mock('../src/api/v1/repositories/firestoreRepository');

// Test data for flashcard service unit tests
const user_001 = {
    role: "user",
    uid: "user_001"
};
const user_002 = {
    role: "user",
    uid: "user_002"
};
const admin = {
    role: "admin",
    uid: "admin_001"
};
const DECK_001 = "deck_001"
const CARD_001 = "card_001"
const deck =
{
    id: DECK_001,
    data: () => (
    {
        userId: user_001.uid,
        visibility: false,
        title: "Deck 001",
        description: "",
        cardCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    })
};
const deckData =
{
    userId: user_001.uid,
    visibility: false,
    title: "Deck 001",
    description: "",
    cardCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};
const cardCollection = 
{
    docs: 
    [
        {
            id: CARD_001,
            data: () => (
            {
                question: "Card 001 question",
                answer: "Card 001 answer",
                isMastered: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
        },
        {
            id: "card_002",
            data: () => (
            {
                question: "Card 002 question",
                answer: "Card 002 answer",
                isMastered: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
        }
    ]
};
const card =
{
    id: CARD_001,
    data: () => (
    {
        question: "Card 001 question",
        answer: "Card 001 answer",
        isMastered: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    })
};
const cardData =
{
    id: CARD_001,
    question: "Card 001 question",
    answer: "Card 001 answer",
    isMastered: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

describe('Flashcard Service', () => 
{
    beforeEach(() => 
    {
        jest.clearAllMocks();
    });

    describe('Create Flashcard Service', () =>
    {
        it("should create a flashcard successfully", async () => 
        {
            // Arrange
            const flashcardData = 
            {
                question: "Card 001 question",
                answer: "Card 001 answer"
            };

            (firestoreRepository.getDocumentById as jest.Mock)
                .mockResolvedValue(deck);
            
            (firestoreRepository.getDocuments as jest.Mock)
            .mockResolvedValueOnce({
                docs: []
            });

            (firestoreRepository.createDocument as jest.Mock)
                .mockResolvedValueOnce(CARD_001);

            // Act
            const result: Flashcard = await flashcardService.createFlashcardService(
                DECK_001, 
                flashcardData, 
                user_001);
            
            // Assert
            expect(firestoreRepository.createDocument).toHaveBeenCalledWith(
                "flashcards",
                expect.objectContaining(
                {
                    question: flashcardData.question,
                    answer: flashcardData.answer,
                    isMastered: false,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                })
            );
            expect(result.id).toBe(CARD_001);
            expect(result.question).toBe(flashcardData.question);
            expect(result.answer).toBe(flashcardData.answer);
            expect(result.isMastered).toBe(false)
        });
        
        it("should block flashcard creation if the deck does not belong to the user", async () => 
        {
            // Arrange
            const mockError = new AppError(
                'You do not have permission to modify this deck',
                'FORBIDDEN',
                HTTP_STATUS.FORBIDDEN);
            const flashcardData = 
            {
                question: "Card 001 question",
                answer: "Card 001 answer"
            };

            (firestoreRepository.getDocumentById as jest.Mock)
                .mockResolvedValueOnce(deck);

            // Act & Assert
            await expect(flashcardService.createFlashcardService(
                DECK_001, 
                flashcardData,
                user_002))
                .rejects.toThrow(mockError);
        });
    });

    describe('Get Flashcard Service', () =>
    {
        it("should return flashcard from a public deck successfully"
            + " for anonymous user", async () => 
        {
            // Arrange
            const mockDeck =
            {
                id: DECK_001,
                data: () => (
                {
                    userId: "user_001",
                    visibility: true,
                    title: "Deck 001",
                    description: "",
                    cardCount: 0,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                })
            };

            (firestoreRepository.getDocumentById as jest.Mock)
                .mockResolvedValueOnce(mockDeck);

            // Arrange
            (firestoreRepository.getDocumentById as jest.Mock)
                .mockResolvedValueOnce(card);

            // Act
            const result = await flashcardService.getFlashcardService(DECK_001, CARD_001);
            
            // Assert
            expect(firestoreRepository.getDocumentById)
                .toHaveBeenCalledWith("flashcards", CARD_001);
            expect(result).toEqual(
                {
                    id: CARD_001,
                    question: "Card 001 question",
                    answer: "Card 001 answer",
                    isMastered: false,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                }
            );
        });

        it("should block access to flashcard from private deck for anonymous user", async () => 
        {
            // Arrange
            const mockError = new AppError(
                'You do not have permission to view flashcards in this deck', 
                'FORBIDDEN',
                HTTP_STATUS.FORBIDDEN);

            (firestoreRepository.getDocumentById as jest.Mock)
                .mockResolvedValueOnce(deck);

            // Act & Assert
            await expect(flashcardService.getFlashcardService(DECK_001, CARD_001))
                .rejects.toThrow(mockError);
        });

        it("should return flashcard from a private deck successfully"
            + " if the deck belongs to the user", async () => 
        {
            // Arrange
            (firestoreRepository.getDocumentById as jest.Mock)
                .mockResolvedValueOnce(deck);

            (firestoreRepository.getDocumentById as jest.Mock)
                .mockResolvedValueOnce(card);

            // Act
            const result = await flashcardService.getFlashcardService(DECK_001, CARD_001, user_001);
            
            // Assert
            expect(firestoreRepository.getDocumentById)
                .toHaveBeenCalledWith("flashcards", CARD_001);
            expect(result).toEqual(
                {
                    id: CARD_001,
                    question: "Card 001 question",
                    answer: "Card 001 answer",
                    isMastered: false,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                }
            );
        });

        it("should block access to flashcard from a private deck if the deck does"
            + " not belong to the user and the user is not an admin", async () => 
        {
            // Arrange
            const mockError = new AppError(
                'You do not have permission to view flashcards in this deck', 
                'FORBIDDEN',
                HTTP_STATUS.FORBIDDEN);

            (firestoreRepository.getDocumentById as jest.Mock)
                .mockResolvedValueOnce(deck);

            // Act & Assert
            await expect(flashcardService.getFlashcardService(DECK_001, CARD_001, user_002))
                .rejects.toThrow(mockError);
        });

        it("should return flashcard from a private deck successfully"
            + " if the user is an admin", async () => 
        {
            // Arrange
            (firestoreRepository.getDocumentById as jest.Mock)
                .mockResolvedValueOnce(deck);

            (firestoreRepository.getDocumentById as jest.Mock)
                .mockResolvedValueOnce(card);

            // Act
            const result = await flashcardService.getFlashcardService(DECK_001, CARD_001, admin);
            
            // Assert
            expect(firestoreRepository.getDocumentById)
                .toHaveBeenCalledWith("flashcards", CARD_001);
            expect(result).toEqual(
                {
                    id: CARD_001,
                    question: "Card 001 question",
                    answer: "Card 001 answer",
                    isMastered: false,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                }
            );
        });
    });

    describe('Get Flashcards Service', () =>
    {
        it("should return list of flashcards from a public deck successfully"
            + " for anonymous user", async () => 
        {
            // Arrange
            const mockDeck =
            {
                id: DECK_001,
                data: () => (
                {
                    userId: "user_001",
                    visibility: true,
                    title: "Deck 001",
                    description: "",
                    cardCount: 0,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                })
            };

            // Arrange
            (firestoreRepository.getDocumentById as jest.Mock)
                .mockResolvedValueOnce(mockDeck);

            (firestoreRepository.getDocuments as jest.Mock)
                .mockResolvedValueOnce(cardCollection);

            // Act
            const result = await flashcardService.getAllFlashcardsService(DECK_001);
            
            // Assert
            expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("flashcards");
            expect(result).toEqual(
                [
                    {
                        id: CARD_001,
                        question: "Card 001 question",
                        answer: "Card 001 answer",
                        isMastered: false,
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String)
                    },
                    {
                        id: "card_002",
                        question: "Card 002 question",
                        answer: "Card 002 answer",
                        isMastered: false,
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String)
                    }
                ]
            );
        });

        it("should block access to flashcards from a private deck"
            + " for anonymous user", async () => 
        {
            // Arrange
            const mockError = new AppError(
                'You do not have permission to view flashcards in this deck', 
                'FORBIDDEN',
                HTTP_STATUS.FORBIDDEN);

            (firestoreRepository.getDocumentById as jest.Mock)
                .mockResolvedValueOnce(deck);

            // Act & Assert
             await expect(flashcardService.getAllFlashcardsService(DECK_001))
                .rejects.toThrow(mockError);
        });

        it("should return list of flashcards from a private deck successfully if the deck"
            + " belongs to the user", async () => 
        {
            // Arrange
            (firestoreRepository.getDocumentById as jest.Mock)
                .mockResolvedValueOnce(deck);

            (firestoreRepository.getDocuments as jest.Mock)
                .mockResolvedValueOnce(cardCollection);

            // Act
            const result = await flashcardService.getAllFlashcardsService(DECK_001, user_001);
            
            // Assert
            expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("flashcards");
            expect(result).toEqual(
                [
                    {
                        id: CARD_001,
                        question: "Card 001 question",
                        answer: "Card 001 answer",
                        isMastered: false,
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String)
                    },
                    {
                        id: "card_002",
                        question: "Card 002 question",
                        answer: "Card 002 answer",
                        isMastered: false,
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String)
                    }
                ]
            );
        });

        it("should block access to flashcards from a private deck if the deck does"
            + " not belong to the user and the user is not an admin", async () => 
        {
            // Arrange
            const mockError = new AppError(
                'You do not have permission to view flashcards in this deck', 
                'FORBIDDEN',
                HTTP_STATUS.FORBIDDEN);

            (firestoreRepository.getDocumentById as jest.Mock)
                .mockResolvedValueOnce(deck);

            // Act & Assert
            await expect(flashcardService.getAllFlashcardsService(DECK_001, user_002))
                .rejects.toThrow(mockError);
        });

        it("should return list of flashcards from a private deck"
            + " if the user is an admin", async () => 
        {
            // Arrange
            (firestoreRepository.getDocumentById as jest.Mock)
                .mockResolvedValueOnce(deck);

            (firestoreRepository.getDocuments as jest.Mock)
                .mockResolvedValueOnce(cardCollection);

            // Act
            const result = await flashcardService.getAllFlashcardsService(DECK_001, admin);
            
            // Assert
            expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("flashcards");
            expect(result).toEqual(
                [
                    {
                        id: CARD_001,
                        question: "Card 001 question",
                        answer: "Card 001 answer",
                        isMastered: false,
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String)
                    },
                    {
                        id: "card_002",
                        question: "Card 002 question",
                        answer: "Card 002 answer",
                        isMastered: false,
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String)
                    }
                ]
            ); 
        });
    });

    describe('Update Flashcard Service', () =>
    {
        it("should update a flashcard successfully if the deck"
            + " belongs to the user", async () => 
        {
            // Arrange
            const updatedCardData = 
            {
                ...cardData,
                isMastered: true
            };

            (firestoreRepository.getDocumentById as jest.Mock)
                .mockResolvedValueOnce(deck)
                .mockResolvedValueOnce(deck)
                .mockResolvedValueOnce(card)
                .mockResolvedValueOnce(deck)
                .mockResolvedValueOnce({
                    id: CARD_001,
                    data: () => updatedCardData
                });

            (firestoreRepository.updateDocument as jest.Mock)
                .mockResolvedValueOnce(undefined);

            // Act
            const result = await flashcardService.updateFlashcardService(
                DECK_001,
                CARD_001,
                { 
                    isMastered: true
                },
                user_001
            );

            // Assert
            expect(firestoreRepository.updateDocument).toHaveBeenCalledWith(
                "flashcards",
                CARD_001,
                expect.objectContaining({
                    isMastered: true,
                    updatedAt: expect.any(String)
                })
            );
            expect(result?.isMastered).toBe(true);
        });

        it("should block modification flashcard if the deck does not"
            + " belong to the user", async () => 
        {
            // Arrange
            const mockError = new AppError(
                'You do not have permission to modify flashcards in this deck', 
                'FORBIDDEN',
                HTTP_STATUS.FORBIDDEN);
            const updateData =
            {
                isMastered: true
            };

            (firestoreRepository.getDocumentById as jest.Mock)
                .mockResolvedValueOnce(deck)
                .mockResolvedValueOnce(deck)
                .mockResolvedValueOnce(card);

            // Act & Assert
            await expect(flashcardService.updateFlashcardService(
                DECK_001,
                CARD_001, 
                updateData, 
                user_002))
                .rejects.toThrow(mockError);
        });
    });

    describe('Delete Flashcard Service', () =>
    {
        it("should delete a flashcard successfully if the deck belongs to the user", async () => 
        {
             // Arrange
            (firestoreRepository.getDocumentById as jest.Mock)
                .mockResolvedValueOnce(deck)
                .mockResolvedValueOnce(deck)
                .mockResolvedValueOnce(card);

            (firestoreRepository.deleteDocument as jest.Mock)
                .mockResolvedValueOnce(undefined);

            (firestoreRepository.getDocuments as jest.Mock)
            .mockResolvedValueOnce({
                docs: []
            });

            (firestoreRepository.updateDocument as jest.Mock)
                .mockResolvedValueOnce(undefined);

            // Act
            await flashcardService.deleteFlashcardService(DECK_001, CARD_001, user_001);

            // Assert
            expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith("flashcards", CARD_001);
        });

        it("should block deletion of a deck if the deck does not belong to the user"
            + " and the user is not an admin", async () =>
        {
            // Arrange
            const mockError = new AppError(
                'You do not have permission to delete flashcards in this deck', 
                'FORBIDDEN',
                HTTP_STATUS.FORBIDDEN);

            (firestoreRepository.getDocumentById as jest.Mock)
                .mockResolvedValueOnce(deck)
                .mockResolvedValueOnce(deck)
                .mockResolvedValueOnce(card);

            // Act & Assert
            await expect(flashcardService.deleteFlashcardService(
                DECK_001, 
                CARD_001, 
                user_002))
                .rejects.toThrow(mockError);
        });

        it("should delete a flashcard successfully if the user is an admin", async () => 
        {
            // Arrange
            (firestoreRepository.getDocumentById as jest.Mock)
                .mockResolvedValueOnce(deck)
                .mockResolvedValueOnce(deck)
                .mockResolvedValueOnce(cardData);

            (firestoreRepository.deleteDocument as jest.Mock)
                .mockResolvedValueOnce(undefined);

            (firestoreRepository.getDocuments as jest.Mock)
                .mockResolvedValueOnce({
                    docs: []
                });

            (firestoreRepository.updateDocument as jest.Mock)
                .mockResolvedValueOnce(undefined);

            // Act
            await flashcardService.deleteFlashcardService(DECK_001, CARD_001, admin);

            // Assert
            expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith("flashcards", CARD_001);
        });
    });
});