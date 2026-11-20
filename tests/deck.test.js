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
const deckService = __importStar(require("../src/api/v1/services/deckService"));
// Mock the firebase configuration
jest.mock('../src/config/firebaseConfig', () => ({ db: {} }));
// Mock the repository module
jest.mock('../src/api/v1/repositories/firestoreRepository');
// Test data for deck service unit tests
const DECK_001 = "deck_001";
const deckCollection = {
    docs: [
        {
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
        },
        {
            id: "deck_002",
            data: () => ({
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
            data: () => ({
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
            data: () => ({
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
const privateDeck = {
    id: DECK_001,
    data: () => ({
        userId: "user_001",
        visibility: false,
        title: "Deck 001",
        description: "",
        cardCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    })
};
const privateDeckData = {
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
describe('Deck Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('Create Deck Service', () => {
        it("should create a deck successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const mockUserId = user_001.uid;
            const mockDeckId = privateDeck.id;
            const deckData = {
                title: "Deck 001"
            };
            firestoreRepository.createDocument
                .mockResolvedValue(mockDeckId);
            // Act
            const result = yield deckService.createDeckService(mockUserId, deckData);
            // Assert
            expect(firestoreRepository.createDocument).toHaveBeenCalledWith("decks", expect.objectContaining({
                userId: mockUserId,
                visibility: true,
                title: deckData.title,
                description: "",
                cardCount: 0,
                createdAt: expect.any(String),
                updatedAt: expect.any(String)
            }));
            expect(result.id).toBe(mockDeckId);
            expect(result.userId).toBe(mockUserId);
            expect(result.title).toBe(deckData.title);
        }));
    });
    describe('Get Deck Service', () => {
        it("should return public deck successfully for anonymous user", () => __awaiter(void 0, void 0, void 0, function* () {
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
                .mockResolvedValue(mockDeck);
            // Act
            const result = yield deckService.getDeckService(DECK_001);
            // Assert
            expect(firestoreRepository.getDocumentById)
                .toHaveBeenCalledWith("decks", DECK_001);
            expect(result).toEqual({
                id: DECK_001,
                userId: "user_001",
                visibility: true,
                title: "Deck 001",
                description: "",
                cardCount: 0,
                createdAt: expect.any(String),
                updatedAt: expect.any(String)
            });
        }));
        it("should block access to private deck for anonymous user", () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const mockError = new errors_1.AppError('You do not have permission to access this deck', 'FORBIDDEN', httpConstants_1.HTTP_STATUS.FORBIDDEN);
            firestoreRepository.getDocumentById
                .mockResolvedValue(privateDeck);
            // Act & Assert
            yield expect(deckService.getDeckService(DECK_001)).rejects.toThrow(mockError);
        }));
        it("should return private deck successfully if the deck belongs to the user", () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            firestoreRepository.getDocumentById
                .mockResolvedValue(privateDeck);
            // Act
            const result = yield deckService.getDeckService(DECK_001, user_001);
            // Assert
            expect(firestoreRepository.getDocumentById)
                .toHaveBeenCalledWith("decks", DECK_001);
            expect(result).toEqual({
                id: DECK_001,
                userId: "user_001",
                visibility: false,
                title: "Deck 001",
                description: "",
                cardCount: 0,
                createdAt: expect.any(String),
                updatedAt: expect.any(String)
            });
        }));
        it("should block access to private deck if the deck does not belong to the user"
            + " and the user is not an admin", () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const mockError = new errors_1.AppError('You do not have permission to access this deck', 'FORBIDDEN', httpConstants_1.HTTP_STATUS.FORBIDDEN);
            firestoreRepository.getDocumentById
                .mockResolvedValue(privateDeck);
            // Act & Assert
            yield expect(deckService.getDeckService("deck_002", user_002))
                .rejects.toThrow(mockError);
        }));
        it("should return private deck successfully if the user is an admin", () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            firestoreRepository.getDocumentById
                .mockResolvedValue(privateDeck);
            // Act
            const result = yield deckService.getDeckService(DECK_001, admin);
            // Assert
            expect(firestoreRepository.getDocumentById)
                .toHaveBeenCalledWith("decks", DECK_001);
            expect(result).toEqual({
                id: DECK_001,
                userId: "user_001",
                visibility: false,
                title: "Deck 001",
                description: "",
                cardCount: 0,
                createdAt: expect.any(String),
                updatedAt: expect.any(String)
            });
        }));
    });
    describe('Get Decks Service', () => {
        it("should return list of decks containing all public decks, "
            + "and any private decks belonging to the user", () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            firestoreRepository.getDocuments
                .mockResolvedValue(deckCollection);
            // Act
            const result = yield deckService.getAllDecksService(user_001);
            // Assert
            expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("decks");
            expect(result).toEqual([
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
            ]);
        }));
        it("should return list of all decks if the user is an admin", () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const mockUserId = "admin_001";
            firestoreRepository.getDocuments
                .mockResolvedValue(deckCollection);
            // Act
            const result = yield deckService.getAllDecksService({
                role: "admin",
                uid: mockUserId
            });
            // Assert
            expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("decks");
            expect(result).toEqual([
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
            ]);
        }));
    });
    describe('Update Deck Service', () => {
        it("should update a deck successfully if the deck belongs to the user", () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const updatedDeckData = Object.assign(Object.assign({}, privateDeckData), { description: "A description of Deck 001" });
            firestoreRepository.getDocumentById
                .mockResolvedValueOnce(privateDeck)
                .mockResolvedValueOnce({
                id: DECK_001,
                data: () => updatedDeckData
            });
            firestoreRepository.updateDocument
                .mockResolvedValue(undefined);
            // Act
            const result = yield deckService.updateDeckService(DECK_001, {
                description: "A description of Deck 001"
            }, user_001);
            // Assert
            expect(firestoreRepository.updateDocument).toHaveBeenCalledWith("decks", DECK_001, expect.objectContaining({
                description: "A description of Deck 001",
                updatedAt: expect.any(String)
            }));
            expect(result.description).toBe("A description of Deck 001");
        }));
        it("should block modification of a deck if the deck does not belong to the user", () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const mockError = new errors_1.AppError('You do not have permission to modify this deck', 'FORBIDDEN', httpConstants_1.HTTP_STATUS.FORBIDDEN);
            const updateData = {
                description: "A description of Deck 001"
            };
            firestoreRepository.getDocumentById
                .mockResolvedValueOnce(privateDeck);
            // Act & Assert
            yield expect(deckService.updateDeckService(DECK_001, updateData, user_002))
                .rejects.toThrow(mockError);
        }));
    });
    describe('Delete Deck Service', () => {
        it("should delete a deck successfully if the deck belongs to the user", () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            firestoreRepository.getDocumentById
                .mockResolvedValueOnce(privateDeck);
            firestoreRepository.deleteDocument
                .mockResolvedValue(undefined);
            // // Act
            yield deckService.deleteDeckService(DECK_001, user_001);
            // Assert
            expect(firestoreRepository.getDocumentById).toHaveBeenCalledWith("decks", DECK_001);
            expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith("decks", DECK_001);
        }));
        it("should block deletion of a deck if the deck does not belong to the user"
            + " and the user is not an admin", () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const mockError = new errors_1.AppError('You do not have permission to delete this deck', 'FORBIDDEN', httpConstants_1.HTTP_STATUS.FORBIDDEN);
            firestoreRepository.getDocumentById
                .mockResolvedValueOnce(privateDeck);
            // Act & Assert
            yield expect(deckService.deleteDeckService(DECK_001, user_002))
                .rejects.toThrow(mockError);
        }));
        it("should delete a deck successfully if the user is an admin", () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            firestoreRepository.getDocumentById
                .mockResolvedValueOnce(privateDeck);
            firestoreRepository.deleteDocument
                .mockResolvedValue(undefined);
            // // Act
            yield deckService.deleteDeckService(DECK_001, admin);
            // Assert
            expect(firestoreRepository.getDocumentById).toHaveBeenCalledWith("decks", DECK_001);
            expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith("decks", DECK_001);
        }));
    });
});
