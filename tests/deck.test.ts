// Internal module imports
import { AppError } from '../src/api/v1/errors/errors';
import { HTTP_STATUS } from '../src/constants/httpConstants';
import * as firestoreRepository from '../src/api/v1/repositories/firestoreRepository';
import * as deckService from '../src/api/v1/services/deckService';
import { Deck, DeckData } from '../src/api/v1/models/deckModel';

// Mock the firebase configuration
jest.mock('../src/config/firebaseConfig', () => ({ db: {} }));

// Mock the repository module
jest.mock('../src/api/v1/repositories/firestoreRepository');

// Test data for deck service unit tests
const DECK_001 = "deck_001"
const deckCollection = 
{
    docs: 
    [
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
        },
        {
            id: "deck_002",
            data: () => (
            {
                userId: "user_001",
                visibility: false,
                title: "Deck 002",
                description: "",
                cardCount: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
        },
        {
            id: "deck_003",
            data: () => (
            {
                userId: "user_002",
                visibility: true,
                title: "Deck 003",
                description: "",
                cardCount: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
        },
        {
            id: "deck_004",
            data: () => (
            {
                userId: "user_002",
                visibility: false,
                title: "Deck 004",
                description: "",
                cardCount: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
        }
    ]
};
const privateDeck =
{
    id: DECK_001,
    data: () => (
    {
        userId: "user_001",
        visibility: false,
        title: "Deck 001",
        description: "",
        cardCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    })
};
const privateDeckData =
{
    userId: "user_001",
    visibility: false,
    title: "Deck 001",
    description: "",
    cardCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};
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

describe('Deck Service', () => 
{
    beforeEach(() => 
    {
        jest.clearAllMocks();
    });

    describe('Create Deck Service', () => 
    {
        it("should create a deck successfully", async () => 
        {
            // Arrange
            const mockUserId = user_001.uid;
            const mockDeckId = privateDeck.id;
            const deckData = 
            {
                title: "Deck 001"
            };

            (firestoreRepository.createDocument as jest.Mock)
                .mockResolvedValue(mockDeckId);

            // Act
            const result: Deck = await deckService.createDeckService(mockUserId, deckData);
            
            // Assert
            expect(firestoreRepository.createDocument).toHaveBeenCalledWith(
                "decks",
                expect.objectContaining(
                {
                    userId: mockUserId,
                    visibility: true,
                    title: deckData.title,
                    description: "",
                    cardCount: 0,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                })
            );
            expect(result.id).toBe(mockDeckId);
            expect(result.userId).toBe(mockUserId);
            expect(result.title).toBe(deckData.title);
        });
    });

    describe('Get Deck Service', () => 
    {
        it("should return public deck successfully for anonymous user", async () => 
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
                .mockResolvedValue(mockDeck);

            // Act
            const result = await deckService.getDeckService(DECK_001);
            
            // Assert
            expect(firestoreRepository.getDocumentById)
                .toHaveBeenCalledWith("decks", DECK_001);
            expect(result).toEqual(
                {
                    id: DECK_001,
                    userId: "user_001",
                    visibility: true,
                    title: "Deck 001",
                    description: "",
                    cardCount: 0,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                }
            );
        });

        it("should block access to private deck for anonymous user", async () => 
        {
            // Arrange
            const mockError = new AppError(
                'You do not have permission to access this deck',
                'FORBIDDEN',
                HTTP_STATUS.FORBIDDEN);

            (firestoreRepository.getDocumentById as jest.Mock)
                .mockResolvedValue(privateDeck);

            // Act & Assert
            await expect(deckService.getDeckService(DECK_001)).rejects.toThrow(mockError);
        });

        it("should return private deck successfully if the deck belongs to the user", async () => 
        {
            // Arrange
            (firestoreRepository.getDocumentById as jest.Mock)
                .mockResolvedValue(privateDeck);

            // Act
            const result = await deckService.getDeckService(DECK_001, user_001);
            
            // Assert
            expect(firestoreRepository.getDocumentById)
                .toHaveBeenCalledWith("decks", DECK_001);
            expect(result).toEqual(
                {
                    id: DECK_001,
                    userId: "user_001",
                    visibility: false,
                    title: "Deck 001",
                    description: "",
                    cardCount: 0,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                }
            );
        });

        it("should block access to private deck if the deck does not belong to the user"
            + " and the user is not an admin", async () => 
        {
            // Arrange
            const mockError = new AppError(
                'You do not have permission to access this deck',
                'FORBIDDEN',
                HTTP_STATUS.FORBIDDEN);

            (firestoreRepository.getDocumentById as jest.Mock)
                .mockResolvedValue(privateDeck);

            // Act & Assert
            await expect(deckService.getDeckService("deck_002", user_002))
                .rejects.toThrow(mockError);
        });

        it("should return private deck successfully if the user is an admin", async () => 
        {
            // Arrange
            (firestoreRepository.getDocumentById as jest.Mock)
                .mockResolvedValue(privateDeck);

            // Act
            const result = await deckService.getDeckService(DECK_001, admin);
            
            // Assert
            expect(firestoreRepository.getDocumentById)
                .toHaveBeenCalledWith("decks", DECK_001);
            expect(result).toEqual(
                {
                    id: DECK_001,
                    userId: "user_001",
                    visibility: false,
                    title: "Deck 001",
                    description: "",
                    cardCount: 0,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                }
            );
        });
    });

    describe('Get Decks Service', () =>
    {
        it("should return list of decks containing all public decks, "
        + "and any private decks belonging to the user", async () => 
        {
            // Arrange
            (firestoreRepository.getDocuments as jest.Mock)
                .mockResolvedValue(deckCollection);

            // Act
            const result = await deckService.getAllDecksService(user_001);
            
            // Assert
            expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("decks");
            expect(result).toEqual(
                [
                    {
                        id: DECK_001,
                        userId: "user_001",
                        visibility: true,
                        title: "Deck 001",
                        description: "",
                        cardCount: 0,
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String)
                    },
                    {
                        id: "deck_002",
                        userId: "user_001",
                        visibility: false,
                        title: "Deck 002",
                        description: "",
                        cardCount: 0,
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String)
                    },
                    {
                        id: "deck_003",
                        userId: "user_002",
                        visibility: true,
                        title: "Deck 003",
                        description: "",
                        cardCount: 0,
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String)
                    }
                ]
            );
        });

        it("should return list of all decks if the user is an admin", async () => 
        {
            // Arrange
            const mockUserId: string = "admin_001";

            (firestoreRepository.getDocuments as jest.Mock)
                .mockResolvedValue(deckCollection);

            // Act
            const result = await deckService.getAllDecksService({ 
                role: "admin", 
                uid: mockUserId 
            });
            
            // Assert
            expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("decks");
            expect(result).toEqual(
                [
                    {
                        id: DECK_001,
                        userId: "user_001",
                        visibility: true,
                        title: "Deck 001",
                        description: "",
                        cardCount: 0,
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String)
                    },
                    {
                        id: "deck_002",
                        userId: "user_001",
                        visibility: false,
                        title: "Deck 002",
                        description: "",
                        cardCount: 0,
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String)
                    },
                    {
                        id: "deck_003",
                        userId: "user_002",
                        visibility: true,
                        title: "Deck 003",
                        description: "",
                        cardCount: 0,
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String)
                    },
                    {
                        id: "deck_004",
                        userId: "user_002",
                        visibility: false,
                        title: "Deck 004",
                        description: "",
                        cardCount: 0,
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String)
                    }
                ]
            );
        });
    });

    describe('Update Deck Service', () =>
    {
        it("should update a deck successfully if the deck belongs to the user", async () => 
        {
            // Arrange
            const updatedDeckData = 
            {
                ...privateDeckData,
                description: "A description of Deck 001"
            };

            (firestoreRepository.getDocumentById as jest.Mock)
                .mockResolvedValueOnce(privateDeck)
                .mockResolvedValueOnce({
                    id: DECK_001,
                    data: () => updatedDeckData
                });

            (firestoreRepository.updateDocument as jest.Mock)
                .mockResolvedValue(undefined);

            // Act
            const result = await deckService.updateDeckService(
                DECK_001,
                { 
                    description: "A description of Deck 001"
                },
                user_001
            );

            // Assert
            expect(firestoreRepository.updateDocument).toHaveBeenCalledWith(
                "decks",
                DECK_001,
                expect.objectContaining({
                    description: "A description of Deck 001",
                    updatedAt: expect.any(String)
                })
            );
            expect(result.description).toBe("A description of Deck 001");
        });

        it("should block modification of a deck if the deck does not belong to the user", async () => 
        {
            // Arrange
            const mockError = new AppError(
                'You do not have permission to modify this deck',
                'FORBIDDEN',
                HTTP_STATUS.FORBIDDEN);
            const updateData =
            {
                description:  "A description of Deck 001"
            };

            (firestoreRepository.getDocumentById as jest.Mock)
                .mockResolvedValueOnce(privateDeck);

            // Act & Assert
            await expect(deckService.updateDeckService(DECK_001, updateData, user_002))
                .rejects.toThrow(mockError);
        });
    });

    describe('Delete Deck Service', () =>
    {
        it("should delete a deck successfully if the deck belongs to the user", async () => 
        {
            // Arrange
            (firestoreRepository.getDocumentById as jest.Mock)
                .mockResolvedValueOnce(privateDeck);

            (firestoreRepository.deleteDocument as jest.Mock)
                .mockResolvedValue(undefined);

            // // Act
            await deckService.deleteDeckService(DECK_001, user_001);

            // Assert
            expect(firestoreRepository.getDocumentById).toHaveBeenCalledWith("decks", DECK_001);
            expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith("decks", DECK_001);
        });

        it("should block deletion of a deck if the deck does not belong to the user"
            + " and the user is not an admin", async () =>
        {
            // Arrange
            const mockError = new AppError(
                'You do not have permission to delete this deck',
                'FORBIDDEN',
                HTTP_STATUS.FORBIDDEN);

            (firestoreRepository.getDocumentById as jest.Mock)
                .mockResolvedValueOnce(privateDeck);

            // Act & Assert
            await expect(deckService.deleteDeckService(DECK_001, user_002))
                .rejects.toThrow(mockError);
        });

        it("should delete a deck successfully if the user is an admin", async () => 
        {
            // Arrange
            (firestoreRepository.getDocumentById as jest.Mock)
                .mockResolvedValueOnce(privateDeck);

            (firestoreRepository.deleteDocument as jest.Mock)
                .mockResolvedValue(undefined);

            // // Act
            await deckService.deleteDeckService(DECK_001, admin);

            // Assert
            expect(firestoreRepository.getDocumentById).toHaveBeenCalledWith("decks", DECK_001);
            expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith("decks", DECK_001);
        });
    });
});