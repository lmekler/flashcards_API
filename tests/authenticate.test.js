"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Internal module imports
const authenticate_1 = __importDefault(require("../src/api/v1/middleware/authenticate"));
const errors_1 = require("../src/api/v1/errors/errors");
const firebaseConfig_1 = require("../src/config/firebaseConfig");
// Mock the Firebase config module
jest.mock("../src/config/firebaseConfig", () => ({
    auth: {
        verifyIdToken: jest.fn(),
    },
}));
describe("Authentication Middleware", () => {
    let mockRequest;
    let mockResponse;
    let nextFunction;
    beforeEach(() => {
        // Reset mocks between tests
        jest.clearAllMocks();
        // Set up basic mock objects
        mockRequest = {
            headers: {},
        };
        mockResponse = {
            locals: {},
        };
        nextFunction = jest.fn();
    });
    it("should call next() when authentication is not required"
        + " and no token is provided", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const middleware = (0, authenticate_1.default)(false);
        mockRequest.headers = {};
        // Act
        yield middleware(mockRequest, mockResponse, nextFunction);
        // Assert
        expect(firebaseConfig_1.auth.verifyIdToken).not.toHaveBeenCalled();
        expect(nextFunction).toHaveBeenCalled();
    }));
    it("should call next with AuthenticationError when no token"
        + " is provided and auth is required", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const middleware = (0, authenticate_1.default)(true);
        mockRequest.headers = {};
        // Act
        yield middleware(mockRequest, mockResponse, nextFunction);
        // Assert
        expect(nextFunction).toHaveBeenCalledWith(expect.any(errors_1.AuthenticationError));
        expect(firebaseConfig_1.auth.verifyIdToken).not.toHaveBeenCalled();
    }));
    it("should call next with AuthenticationError when token is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const middleware = (0, authenticate_1.default)(true);
        mockRequest.headers = {
            authorization: "Bearer invalid-token",
        };
        firebaseConfig_1.auth.verifyIdToken.mockRejectedValueOnce(new Error("Firebase Error: Invalid token"));
        // Act
        yield middleware(mockRequest, mockResponse, nextFunction);
        // Assert
        expect(firebaseConfig_1.auth.verifyIdToken).toHaveBeenCalledWith("invalid-token");
        expect(nextFunction).toHaveBeenCalledWith(expect.any(errors_1.AuthenticationError));
    }));
    it("should call next() and set user data when token is valid", () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const middleware = (0, authenticate_1.default)(true);
        mockRequest.headers = {
            authorization: "Bearer valid-token",
        };
        const mockDecodedToken = {
            uid: "user_001",
            role: "user",
        };
        firebaseConfig_1.auth.verifyIdToken.mockResolvedValueOnce(mockDecodedToken);
        // Act
        yield middleware(mockRequest, mockResponse, nextFunction);
        // Assert
        expect(firebaseConfig_1.auth.verifyIdToken).toHaveBeenCalledWith("valid-token");
        expect(mockResponse.locals.uid).toBe("user_001");
        expect(mockResponse.locals.role).toBe("user");
        expect(nextFunction).toHaveBeenCalled();
    }));
});
