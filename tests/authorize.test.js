"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Internal module imports
const authorize_1 = __importDefault(require("../src/api/v1/middleware/authorize"));
const errors_1 = require("../src/api/v1/errors/errors");
describe("isAuthorized middleware", () => {
    let mockRequest;
    let mockResponse;
    let nextFunction;
    beforeEach(() => {
        mockRequest = {
            params: {},
        };
        mockResponse = {
            locals: {},
        };
        nextFunction = jest.fn();
    });
    it("should call next() when user has required role", () => {
        // Arrange
        mockResponse.locals = {
            uid: "admin_001",
            role: "admin",
        };
        const middleware = (0, authorize_1.default)(true, { hasRole: ["admin"] });
        // Act
        middleware(mockRequest, mockResponse, nextFunction);
        // Assert
        expect(nextFunction).toHaveBeenCalledWith();
    });
    it("should pass AuthorizationError to next() when user has insufficient role", () => {
        // Arrange
        mockResponse.locals = {
            uid: "user_001",
            role: "user",
        };
        const middleware = (0, authorize_1.default)(true, { hasRole: ["admin"] });
        // Act
        middleware(mockRequest, mockResponse, nextFunction);
        // Assert
        expect(nextFunction).toHaveBeenCalledWith(expect.any(errors_1.AuthorizationError));
        const error = nextFunction.mock.calls[0][0];
        expect(error.message).toBe("Forbidden: Insufficient role");
        expect(error.code).toBe("INSUFFICIENT_ROLE");
    });
    it("should pass AuthorizationError to next() when role is missing", () => {
        // Arrange
        mockResponse.locals = {
            uid: "user_001",
        };
        const middleware = (0, authorize_1.default)(true, { hasRole: ["admin"] });
        // Act
        middleware(mockRequest, mockResponse, nextFunction);
        // Assert
        expect(nextFunction).toHaveBeenCalledWith(expect.any(errors_1.AuthorizationError));
        const error = nextFunction.mock.calls[0][0];
        expect(error.message).toBe("Forbidden: No role found");
        expect(error.code).toBe("ROLE_NOT_FOUND");
    });
});
