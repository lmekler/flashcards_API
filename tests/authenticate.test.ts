// External module imports
import { Request, Response } from "express";

// Internal module imports
import authenticate from "../src/api/v1/middleware/authenticate";
import { AuthenticationError } from "../src/api/v1/errors/errors";
import { auth } from "../src/config/firebaseConfig";

// Mock the Firebase config module
jest.mock("../src/config/firebaseConfig", () => ({
    auth: {
        verifyIdToken: jest.fn(),
    },
}));

describe("Authentication Middleware", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock;

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
        + " and no token is provided", async () => 
    {
        // Arrange
        const middleware = authenticate(false);

        mockRequest.headers = {};

        // Act
        await middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(auth.verifyIdToken).not.toHaveBeenCalled();
        expect(nextFunction).toHaveBeenCalled();
    });

    it("should call next with AuthenticationError when no token"
        + " is provided and auth is required", async () => 
    {
        // Arrange
        const middleware = authenticate(true);

        mockRequest.headers = {};

        // Act
        await middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(nextFunction).toHaveBeenCalledWith(
            expect.any(AuthenticationError)
        );

        expect(auth.verifyIdToken).not.toHaveBeenCalled();
    });

    it("should call next with AuthenticationError when token is invalid", async () => 
    {
        // Arrange
        const middleware = authenticate(true);

        mockRequest.headers = {
            authorization: "Bearer invalid-token",
        };

        (auth.verifyIdToken as jest.Mock).mockRejectedValueOnce(
            new Error("Firebase Error: Invalid token")
        );

        // Act
        await middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(auth.verifyIdToken).toHaveBeenCalledWith("invalid-token");

        expect(nextFunction).toHaveBeenCalledWith(
            expect.any(AuthenticationError)
        );
    });
    it("should call next() and set user data when token is valid", async () => 
    {
        // Arrange
        const middleware = authenticate(true);

        mockRequest.headers = {
            authorization: "Bearer valid-token",
        };

        const mockDecodedToken = {
            uid: "user_001",
            role: "user",
        };

        (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce(
            mockDecodedToken
        );

        // Act
        await middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(auth.verifyIdToken).toHaveBeenCalledWith("valid-token");

        expect(mockResponse.locals!.uid).toBe("user_001");
        expect(mockResponse.locals!.role).toBe("user");

        expect(nextFunction).toHaveBeenCalled();
    });
});