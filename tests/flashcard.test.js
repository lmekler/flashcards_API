"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// Internal module imports
const errors_1 = require("../src/api/v1/errors/errors");
const httpConstants_1 = require("../src/constants/httpConstants");
const firestoreRepository = __importStar(require("../src/api/v1/repositories/firestoreRepository"));
const flashcardService = __importStar(require("../src/api/v1/services/flashcardService"));
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
const DECK_001 = "deck_001";
const CARD_001 = "card_001";
const deck = {
    id: DECK_001,
    data: () => ({
        userId: user_001.uid,
        visibility: false,
        title: "Deck 001",
        description: "",
        cardCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    })
};
const deckData = {
    userId: user_001.uid,
    visibility: false,
    title: "Deck 001",
    description: "",
    cardCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};
const cardCollection = {
    docs: [
        {
            id: CARD_001,
            data: () => ({
                question: "Card 001 question",
                answer: "Card 001 answer",
                isMastered: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
        },
        {
            id: "card_002",
            data: () => ({
                question: "Card 002 question",
                answer: "Card 002 answer",
                isMastered: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
        }
    ]
};
const card = {
    id: CARD_001,
    data: () => ({
        question: "Card 001 question",
        answer: "Card 001 answer",
        isMastered: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    })
};
const cardData = {
    id: CARD_001,
    question: "Card 001 question",
    answer: "Card 001 answer",
    isMastered: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};
describe('Flashcard Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('Create Flashcard Service', () => {
        it("should create a flashcard successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const flashcardData = {
                question: "Card 001 question",
                answer: "Card 001 answer"
            };
            firestoreRepository.getDocumentById
                .mockResolvedValue(deck);
            firestoreRepository.getDocuments
                .mockResolvedValueOnce({
                docs: []
            });
            firestoreRepository.createDocument
                .mockResolvedValueOnce(CARD_001);
            // Act
            const result = yield flashcardService.createFlashcardService(DECK_001, flashcardData, user_001);
            // Assert
            expect(firestoreRepository.createDocument).toHaveBeenCalledWith("flashcards", expect.objectContaining({
                question: flashcardData.question,
                answer: flashcardData.answer,
                isMastered: false,
                createdAt: expect.any(String),
                updatedAt: expect.any(String)
            }));
            expect(result.id).toBe(CARD_001);
            expect(result.question).toBe(flashcardData.question);
            expect(result.answer).toBe(flashcardData.answer);
            expect(result.isMastered).toBe(false);
        }));
        it("should block flashcard creation if the deck does not belong to the user", () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const mockError = new errors_1.AppError('You do not have permission to modify this deck', 'FORBIDDEN', httpConstants_1.HTTP_STATUS.FORBIDDEN);
            const flashcardData = {
                question: "Card 001 question",
                answer: "Card 001 answer"
            };
            firestoreRepository.getDocumentById
                .mockResolvedValueOnce(deck);
            // Act & Assert
            yield expect(flashcardService.createFlashcardService(DECK_001, flashcardData, user_002))
                .rejects.toThrow(mockError);
        }));
    });
    describe('Get Flashcard Service', () => {
        it("should return flashcard from a public deck successfully"
            + " for anonymous user", () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const mockDeck = {
                id: DECK_001,
                data: () => ({
                    userId: "user_001",
                    visibility: true,
                    title: "Deck 001",
                    description: "",
                    cardCount: 0,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                })
            };
            firestoreRepository.getDocumentById
                .mockResolvedValueOnce(mockDeck);
            // Arrange
            firestoreRepository.getDocumentById
                .mockResolvedValueOnce(card);
            // Act
            const result = yield flashcardService.getFlashcardService(DECK_001, CARD_001);
            // Assert
            expect(firestoreRepository.getDocumentById)
                .toHaveBeenCalledWith("flashcards", CARD_001);
            expect(result).toEqual({
                id: CARD_001,
                question: "Card 001 question",
                answer: "Card 001 answer",
                isMastered: false,
                createdAt: expect.any(String),
                updatedAt: expect.any(String)
            });
        }));
        it("should block access to flashcard from private deck for anonymous user", () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const mockError = new errors_1.AppError('You do not have permission to view flashcards in this deck', 'FORBIDDEN', httpConstants_1.HTTP_STATUS.FORBIDDEN);
            firestoreRepository.getDocumentById
                .mockResolvedValueOnce(deck);
            // Act & Assert
            yield expect(flashcardService.getFlashcardService(DECK_001, CARD_001))
                .rejects.toThrow(mockError);
        }));
        it("should return flashcard from a private deck successfully"
            + " if the deck belongs to the user", () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            firestoreRepository.getDocumentById
                .mockResolvedValueOnce(deck);
            firestoreRepository.getDocumentById
                .mockResolvedValueOnce(card);
            // Act
            const result = yield flashcardService.getFlashcardService(DECK_001, CARD_001, user_001);
            // Assert
            expect(firestoreRepository.getDocumentById)
                .toHaveBeenCalledWith("flashcards", CARD_001);
            expect(result).toEqual({
                id: CARD_001,
                question: "Card 001 question",
                answer: "Card 001 answer",
                isMastered: false,
                createdAt: expect.any(String),
                updatedAt: expect.any(String)
            });
        }));
        it("should block access to flashcard from a private deck if the deck does"
            + " not belong to the user and the user is not an admin", () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const mockError = new errors_1.AppError('You do not have permission to view flashcards in this deck', 'FORBIDDEN', httpConstants_1.HTTP_STATUS.FORBIDDEN);
            firestoreRepository.getDocumentById
                .mockResolvedValueOnce(deck);
            // Act & Assert
            yield expect(flashcardService.getFlashcardService(DECK_001, CARD_001, user_002))
                .rejects.toThrow(mockError);
        }));
        it("should return flashcard from a private deck successfully"
            + " if the user is an admin", () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            firestoreRepository.getDocumentById
                .mockResolvedValueOnce(deck);
            firestoreRepository.getDocumentById
                .mockResolvedValueOnce(card);
            // Act
            const result = yield flashcardService.getFlashcardService(DECK_001, CARD_001, admin);
            // Assert
            expect(firestoreRepository.getDocumentById)
                .toHaveBeenCalledWith("flashcards", CARD_001);
            expect(result).toEqual({
                id: CARD_001,
                question: "Card 001 question",
                answer: "Card 001 answer",
                isMastered: false,
                createdAt: expect.any(String),
                updatedAt: expect.any(String)
            });
        }));
    });
    describe('Get Flashcards Service', () => {
        it("should return list of flashcards from a public deck successfully"
            + " for anonymous user", () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const mockDeck = {
                id: DECK_001,
                data: () => ({
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
            firestoreRepository.getDocumentById
                .mockResolvedValueOnce(mockDeck);
            firestoreRepository.getDocuments
                .mockResolvedValueOnce(cardCollection);
            // Act
            const result = yield flashcardService.getAllFlashcardsService(DECK_001);
            // Assert
            expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("flashcards");
            expect(result).toEqual([
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
            ]);
        }));
        it("should block access to flashcards from a private deck"
            + " for anonymous user", () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const mockError = new errors_1.AppError('You do not have permission to view flashcards in this deck', 'FORBIDDEN', httpConstants_1.HTTP_STATUS.FORBIDDEN);
            firestoreRepository.getDocumentById
                .mockResolvedValueOnce(deck);
            // Act & Assert
            yield expect(flashcardService.getAllFlashcardsService(DECK_001))
                .rejects.toThrow(mockError);
        }));
        it("should return list of flashcards from a private deck successfully if the deck"
            + " belongs to the user", () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            firestoreRepository.getDocumentById
                .mockResolvedValueOnce(deck);
            firestoreRepository.getDocuments
                .mockResolvedValueOnce(cardCollection);
            // Act
            const result = yield flashcardService.getAllFlashcardsService(DECK_001, user_001);
            // Assert
            expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("flashcards");
            expect(result).toEqual([
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
            ]);
        }));
        it("should block access to flashcards from a private deck if the deck does"
            + " not belong to the user and the user is not an admin", () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const mockError = new errors_1.AppError('You do not have permission to view flashcards in this deck', 'FORBIDDEN', httpConstants_1.HTTP_STATUS.FORBIDDEN);
            firestoreRepository.getDocumentById
                .mockResolvedValueOnce(deck);
            // Act & Assert
            yield expect(flashcardService.getAllFlashcardsService(DECK_001, user_002))
                .rejects.toThrow(mockError);
        }));
        it("should return list of flashcards from a private deck"
            + " if the user is an admin", () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            firestoreRepository.getDocumentById
                .mockResolvedValueOnce(deck);
            firestoreRepository.getDocuments
                .mockResolvedValueOnce(cardCollection);
            // Act
            const result = yield flashcardService.getAllFlashcardsService(DECK_001, admin);
            // Assert
            expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("flashcards");
            expect(result).toEqual([
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
            ]);
        }));
    });
    describe('Update Flashcard Service', () => {
        it("should update a flashcard successfully if the deck"
            + " belongs to the user", () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const updatedCardData = Object.assign(Object.assign({}, cardData), { isMastered: true });
            firestoreRepository.getDocumentById
                .mockResolvedValueOnce(deck)
                .mockResolvedValueOnce(card)
                .mockResolvedValueOnce({
                id: CARD_001,
                data: () => updatedCardData
            });
            firestoreRepository.updateDocument
                .mockResolvedValueOnce(undefined);
            // Act
            const result = yield flashcardService.updateFlashcardService(DECK_001, CARD_001, {
                isMastered: true
            }, user_001);
            // Assert
            expect(firestoreRepository.updateDocument).toHaveBeenCalledWith("flashcards", CARD_001, expect.objectContaining({
                isMastered: true,
                updatedAt: expect.any(String)
            }));
            expect(result === null || result === void 0 ? void 0 : result.isMastered).toBe(true);
        }));
        it("should block modification flashcard if the deck does not"
            + " belong to the user", () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const mockError = new errors_1.AppError('You do not have permission to modify flashcards in this deck', 'FORBIDDEN', httpConstants_1.HTTP_STATUS.FORBIDDEN);
            const updateData = {
                isMastered: true
            };
            firestoreRepository.getDocumentById
                .mockResolvedValueOnce(deck)
                .mockResolvedValueOnce(deck)
                .mockResolvedValueOnce(card);
            // Act & Assert
            yield expect(flashcardService.updateFlashcardService(DECK_001, CARD_001, updateData, user_002))
                .rejects.toThrow(mockError);
        }));
    });
    describe('Delete Flashcard Service', () => {
        it("should delete a flashcard successfully if the deck belongs to the user", () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            firestoreRepository.getDocumentById
                .mockResolvedValueOnce(deck)
                .mockResolvedValueOnce(deck)
                .mockResolvedValueOnce(card);
            firestoreRepository.deleteDocument
                .mockResolvedValueOnce(undefined);
            firestoreRepository.getDocuments
                .mockResolvedValueOnce({
                docs: []
            });
            firestoreRepository.updateDocument
                .mockResolvedValueOnce(undefined);
            // Act
            yield flashcardService.deleteFlashcardService(DECK_001, CARD_001, user_001);
            // Assert
            expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith("flashcards", CARD_001);
        }));
        it("should block deletion of a deck if the deck does not belong to the user"
            + " and the user is not an admin", () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const mockError = new errors_1.AppError('You do not have permission to delete flashcards in this deck', 'FORBIDDEN', httpConstants_1.HTTP_STATUS.FORBIDDEN);
            firestoreRepository.getDocumentById
                .mockResolvedValueOnce(deck)
                .mockResolvedValueOnce(deck)
                .mockResolvedValueOnce(card);
            // Act & Assert
            yield expect(flashcardService.deleteFlashcardService(DECK_001, CARD_001, user_002))
                .rejects.toThrow(mockError);
        }));
        it("should delete a flashcard successfully if the user is an admin", () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            firestoreRepository.getDocumentById
                .mockResolvedValueOnce(deck)
                .mockResolvedValueOnce(deck)
                .mockResolvedValueOnce(cardData);
            firestoreRepository.deleteDocument
                .mockResolvedValueOnce(undefined);
            firestoreRepository.getDocuments
                .mockResolvedValueOnce({
                docs: []
            });
            firestoreRepository.updateDocument
                .mockResolvedValueOnce(undefined);
            // Act
            yield flashcardService.deleteFlashcardService(DECK_001, CARD_001, admin);
            // Assert
            expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith("flashcards", CARD_001);
        }));
    });
});
