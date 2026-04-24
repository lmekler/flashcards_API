// Internal module imports
import * as firestoreRepository from '../src/api/v1/repositories/firestoreRepository';
import * as flashcardService from '../src/api/v1/services/flashcardService';
import { Flashcard } from '../src/api/v1/models/flashcardModel';

// Mock the repository module
jest.mock('../src/api/v1/repositories/firestoreRepository');

describe('Flashcard Service', () => 
{
    beforeEach(() => 
    {
        jest.clearAllMocks();
    });

    // it("should create a flashcard successfully", async () => 
    // {
    //     // Arrange
    //     const mockFlashcard: Flashcard = 
    //     {
    //         question: "A question",
    //         answer: "An answer"
    //     };

    //     const mockUserId: string = "testUserId";
    //     const mockFlashcardId: string = "flashcard1";

    //     (firestoreRepository.createDocument as jest.Mock)
    //         .mockResolvedValue(mockFlashcardId);

    //     // Act
    //     const result: Flashcard = await flashcardService.createFlashcardService(mockUserId, mockFlashcard);
        
    //     // Assert
    //     expect(firestoreRepository.createDocument).toHaveBeenCalledWith(
    //         "flashcards",
    //         expect.objectContaining(
    //         {
    //             question: mockFlashcard.question,
    //             answer: mockFlashcard.answer,
    //             isMastered: false,
    //             createdAt: expect.any(String)
    //         })
    //     );
    //     expect(result.id).toBe(mockFlashcardId);
    //     expect(result.question).toBe(mockFlashcard.question);
    // });

    // it("should return list of flashcards successfully", async () => 
    // {
    //     // Arrange
    //     const mockFlashcardCollection = 
    //     {
    //         docs: 
    //         [
    //             {
    //                 id: "flashcard1",
    //                 data: () => (
    //                 {
    //                     question: "A question",
    //                     answer: "An answer",
    //                     isMastered: false,
    //                     createdAt: new Date().toISOString()
    //                 })
    //             },
    //             {
    //                 id: "flashcard2",
    //                 data: () => (
    //                 {
    //                     question: "A question",
    //                     answer: "An answer",
    //                     isMastered: true,
    //                     createdAt: new Date().toISOString()
    //                 })
    //             }
    //         ]
    //     };

    //     const mockDeckId: string = "testDeckId";

    //     (firestoreRepository.getDocuments as jest.Mock)
    //         .mockResolvedValue(mockFlashcardCollection);

    //     // Act
    //     const result = await flashcardService.getAllFlashcardsService(mockDeckId);
        
    //     // Assert
    //     expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("flashcards");
    //     expect(result).toEqual(
    //         [
    //             {
    //                 id: "flashcard1",
    //                 question: "A question",
    //                 answer: "An answer",
    //                 isMastered: false,
    //                 createdAt: expect.any(String)
    //             },
    //             {
    //                 id: "flashcard2",
    //                 question: "A question",
    //                 answer: "An answer",
    //                 isMastered: true,
    //                 createdAt: expect.any(String)
    //             }
    //         ]
    //     );
    // });

    // it("should return flashcard by id successfully", async () => 
    // {
    //     // Arrange
    //     const mockFlashcard =
    //     {
    //         id: "flashcard1",
    //         data: () => (
    //         {
    //             question: "A question",
    //             answer: "An answer",
    //             isMastered: false,
    //             createdAt: new Date().toISOString()
    //         })
    //     };

    //     const mockDeckId: string = "testDeckId";

    //     (firestoreRepository.getDocumentById as jest.Mock)
    //         .mockResolvedValue(mockFlashcard);

    //     // Act
    //     const result = await flashcardService.getFlashcardService(mockDeckId, "flashcard1");
        
    //     // Assert
    //     expect(firestoreRepository.getDocumentById)
    //         .toHaveBeenCalledWith(`decks/${mockDeckId}/flashcards`, "flashcard1");
    //     expect(result).toEqual(
    //         {
    //             id: "flashcard1",
    //             question: "A question",
    //             answer: "An answer",
    //             isMastered: false,
    //             createdAt: expect.any(String)
    //         }
    //     );
    // });

    // it("should update a flashcard successfully", async () => 
    // {
    //     // Arrange
    //     const mockFlashcard = 
    //     {
    //         question: "A question",
    //         answer: "An answer",
    //         isMastered: false,
    //         createdAt: new Date().toISOString()
    //     };

    //     const updatedFlashcard = 
    //     {
    //         ...mockFlashcard,
    //         isMastered: true
    //     };

    //     const mockDeckId: string = "testDeckId";

    //     (firestoreRepository.updateDocument as jest.Mock)
    //         .mockResolvedValue(undefined);

    //     (firestoreRepository.getDocumentById as jest.Mock)
    //         .mockResolvedValueOnce(
    //         {
    //             data: () => updatedFlashcard
    //         });

    //     // Act
    //     const result = await flashcardService.updateFlashcardService(
    //         mockDeckId,
    //         "flashcard1",
    //         { 
    //             isMastered: true
    //         }
    //     );

    //     // Assert
    //     expect(firestoreRepository.updateDocument).toHaveBeenCalledWith(
    //         `decks/${mockDeckId}/flashcards`,
    //         "flashcard1",
    //         {
    //             isMastered: true
    //         }
    //     );

    //     expect(result?.isMastered).toBe(true);
    // });

    // it("should delete a flashcard successfully", async () => 
    // {
    //     // Arrange
    //     const mockDocumentId: string = "flashcard1";
    //     const mockFlashcard: Flashcard = 
    //     {
    //         question: "A question",
    //         answer: "An answer",
    //         isMastered: false,
    //         createdAt: expect.any(String)
    //     }

    //     const mockDeckId: string = "testDeckId";

    //     // jest.spyOn creates a mock for a specific method/function on an object, in our example the itemService
    //     jest.spyOn(flashcardService, "getFlashcardService").mockResolvedValue(mockFlashcard);

    //     // jest.Mock replaces the auto-mocked version with our specific mocked implementation
    //     (firestoreRepository.deleteDocument as jest.Mock).mockResolvedValue(
    //         undefined
    //     );

    //     // Act
    //     await flashcardService.deleteFlashcardService(mockDeckId, mockDocumentId);

    //     // Assert
    //     expect(flashcardService.getFlashcardService).toHaveBeenCalledWith(mockDeckId, mockDocumentId);
    //     expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith(
    //         `decks/${mockDeckId}/flashcards`,
    //         mockDocumentId
    //     );
    // });
});