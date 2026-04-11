import * as deckService from '../src/api/v1/services/deckService';
import * as firestoreRepository from '../src/api/v1/repositories/firestoreRepository';
import { Deck, DeckData } from '../src/api/v1/models/deckModel';

// Mock the repository module
jest.mock('../src/api/v1/repositories/firestoreRepository');

describe('Deck Service', () => 
{
    beforeEach(() => 
    {
        jest.clearAllMocks();
    });

    it("should create a deck successfully", async () => 
    {
        // Arrange
        const mockDeckData: DeckData = 
        {
            title: "My Deck",
            description: "A description of my deck"
        };

        const mockUserId: string = "testUserId";
        const mockDeckId: string = "deck1";

        (firestoreRepository.createDocument as jest.Mock)
            .mockResolvedValue(mockDeckId);

        // Act
        const result: Deck = await deckService.createDeckService(mockUserId, mockDeckData);
        
        // Assert
        expect(firestoreRepository.createDocument).toHaveBeenCalledWith(
            "decks",
            expect.objectContaining(
            {
                title: mockDeckData.title,
                description: mockDeckData.description,
                cardCount: 0,
                createdAt: expect.any(String)
            })
        );
        expect(result.id).toBe(mockDeckId);
        expect(result.title).toBe(mockDeckData.title);
    });

    it("should return list of decks successfully", async () => 
    {
        // Arrange
        const mockDeckCollection = 
        {
            docs: 
            [
                {
                    id: "deck1",
                    data: () => (
                    {
                        userId: "testUserId_1",
                        title: "My Deck 1",
                        description: "A description of my deck",
                        cardCount: 0,
                        createdAt: new Date().toISOString()
                    })
                },
                {
                    id: "deck2",
                    data: () => (
                    {
                        userId: "testUserId_2",
                        title: "My Deck 2",
                        description: "A description of my deck",
                        cardCount: 0,
                        createdAt: new Date().toISOString()
                    })
                }
            ]
        };

        (firestoreRepository.getDocuments as jest.Mock)
            .mockResolvedValue(mockDeckCollection);

        // Act
        const result = await deckService.getAllDecksService();
        
        // Assert
        expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("decks");
        expect(result).toEqual(
            [
                {
                    id: "deck1",
                    userId: "testUserId_1",
                    title: "My Deck 1",
                    description: "A description of my deck",
                    cardCount: 0,
                    createdAt: expect.any(String)
                },
                {
                    id: "deck2",
                    userId: "testUserId_2",
                    title: "My Deck 2",
                    description: "A description of my deck",
                    cardCount: 0,
                    createdAt: expect.any(String)
                }
            ]
        );
    });

    it("should return deck by id successfully", async () => 
    {
        // Arrange
        const mockDeck =
        {
            id: "deck1",
            data: () => (
            {
                userId: "testUserId_1",
                title: "My Deck",
                description: "A description of my deck",
                cardCount: 0,
                createdAt: new Date().toISOString()
            })
        };

        (firestoreRepository.getDocumentById as jest.Mock)
            .mockResolvedValue(mockDeck);

        // Act
        const result = await deckService.getDeckService("deck1");
        
        // Assert
        expect(firestoreRepository.getDocumentById)
            .toHaveBeenCalledWith("decks", "deck1");
        expect(result).toEqual(
            {
                id: "deck1",
                userId: "testUserId_1",
                title: "My Deck",
                description: "A description of my deck",
                cardCount: 0,
                createdAt: expect.any(String)
            }
        );
    });

    it("should update a deck successfully", async () => 
    {
        // Arrange
        const mockDeck = 
        {
            title: "My Deck",
            cardCount: 0,
            createdAt: new Date().toISOString()
        };

        const updatedDeckData = 
        {
            ...mockDeck,
            description: "A description of my deck"
        };

        (firestoreRepository.updateDocument as jest.Mock)
            .mockResolvedValue(undefined);

        (firestoreRepository.getDocumentById as jest.Mock)
            .mockResolvedValueOnce(
            {
                data: () => updatedDeckData
            });

        // Act
        const result = await deckService.updateDeckService(
            "deck1",
            { 
                description: "A description of my deck"
            }
        );

        // Assert
        expect(firestoreRepository.updateDocument).toHaveBeenCalledWith(
            "decks",
            "deck1",
            {
                description: "A description of my deck"
            }
        );

        expect(result?.description).toBe("A description of my deck");
    });

    it("should delete a deck successfully", async () => 
    {
        // Arrange
        const mockDocumentId: string = "deck1";
        const mockDeck: Deck = 
        {
            title: "My Deck",
            userId: "testUserId_1",
            description: "A description of my deck",
            cardCount: 0,
            createdAt: expect.any(String)
        }

        // jest.spyOn creates a mock for a specific method/function on an object, in our example the itemService
        jest.spyOn(deckService, "getDeckService").mockResolvedValue(mockDeck);

        // jest.Mock replaces the auto-mocked version with our specific mocked implementation
        (firestoreRepository.deleteDocument as jest.Mock).mockResolvedValue(
            undefined
        );

        // Act
        await deckService.deleteDeckService(mockDocumentId);

        // Assert
        expect(deckService.getDeckService).toHaveBeenCalledWith(mockDocumentId);
        expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith(
            "decks",
            mockDocumentId
        );
    });
});