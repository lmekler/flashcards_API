// Ecternal module imports
import { Request, Response, NextFunction } from 'express';

// Internal module imports
import { validateRequest } from '../src/api/v1/middleware/validate';
import { deckSchemas } from '../src/api/v1/validation/deckSchemas';

describe('validateRequest Middleware', () => 
{
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => 
    {
        mockReq = 
        {
            headers: {},
            params: {},
            body: {}
        };

        mockRes = 
        {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {}
        };
        
        mockNext = jest.fn();
    });

    describe('Deck Create Schema', () =>
    {
        it('should pass for valid input', () => 
        {
            // Arrange
            mockReq.body = 
            { 
                visibility: true,
                title: "Deck 001",
                description: "A description of Deck 001"
            };

            const middleware = validateRequest(deckSchemas.create);

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockNext).toHaveBeenCalled();
            expect(mockRes.status).not.toHaveBeenCalled();
            expect(mockRes.json).not.toHaveBeenCalled();
        });

        it('should fail for missing title', () => 
        {
            // Arrange
            mockReq.body = {};

            const middleware = validateRequest(deckSchemas.create);

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: expect.stringContaining("Validation error: Body: Title is required")
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should fail for non boolean visibility', () => 
        {
            // Arrange
            mockReq.body = 
            {
                visibility: "Private",
                title: "Deck 001"
            };

            const middleware = validateRequest(deckSchemas.create);

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: expect.stringContaining("Validation error: Body: Visibility must be a boolean value")
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should fail for empty title', () => 
        {
            // Arrange
            mockReq.body = 
            {
                title: ""
            };

            const middleware = validateRequest(deckSchemas.create);

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: expect.stringContaining("Validation error: Body: Title cannot be empty")
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should fail for title exceeding 100 characters', () => 
        {
            // Arrange
            mockReq.body = 
            {
                // This title is 101 characters long
                title: "Mdp0TRRJM5rntO7j279wo5QyR6xjjP5O8rRxPrNnHxAzatTnwE9p"
                + "ang0DTOevMvdD4WNf26Oamv57DKBjpQJ5VPOtvDmHCKKTkESB"
            };

            const middleware = validateRequest(deckSchemas.create);

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: expect.stringContaining("Validation error: Body: Title cannot exceed 100 characters")
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should fail for description exceeding 500 characters', () => 
        {
            // Arrange
            mockReq.body = 
            {
                title: "Deck 001",
                // This description is 501 characters long
                description: "NJToZgFuMOGsjvxY9HV1JctrW7NGeqxOvydtrMEbWDU"
                + "zespHJYM645OPPxAZJGbRXQPFWN71V3rcOSbwbBdrWRZhumeK"
                + "DezmrzGbhZxdJB0BH8pmuzUwnYf9n5rEk7fwzQEE1DUFh5t063FW"
                + "PFDu8E0UkZNjWMeOOkUPEzjtsdcrMMg3wW872DdV0duqWUFQ7"
                + "gMzWrWAsWpByoTVaCPbbHabVjbwOcvMkKqXarbhRD4UtNu2mT"
                + "1EJPXz14xASx0cgyXF7qCRmbbcp3pkVa6a8xecujotzcJOHmtymvy7K"
                + "90GrNcYdp6HVbSQQGjE0wQ0Z3fdzbv0tGNWjGGXm8vGGu7NWk0"
                + "Qu2EdPo4AwF58w2sgGYtsW9Q0UvWTduKvA5Nh2QEJ5GjsBnSNfW"
                + "JNGuheqFSNjUnJhndbaT7ajv8O28owbMENV0dCrNZhdMD8k4Y5EV"
                + "DkKKsvUshnYwCRvogZTCsm2gf9OU4jC4b1brdkWKZnV0hAKc9V3"
            };

            const middleware = validateRequest(deckSchemas.create);

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: expect.stringContaining("Validation error: Body: Description cannot exceed 500 characters")
            });
            expect(mockNext).not.toHaveBeenCalled();
        });
    });

    describe('Update Deck Schema', () =>
    {
        it('should fail for non boolean visibility', () => 
        {
            // Arrange
            mockReq.body = 
            {
                visibility: "Private"
            };

            const middleware = validateRequest(deckSchemas.update);

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: expect.stringContaining("Validation error: Body: Visibility must be a boolean value")
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should fail for description exceeding 500 characters', () => 
        {
            // Arrange
            mockReq.body = 
            {
                // This description is 501 characters long
                description: "NJToZgFuMOGsjvxY9HV1JctrW7NGeqxOvydtrMEbWDU"
                + "zespHJYM645OPPxAZJGbRXQPFWN71V3rcOSbwbBdrWRZhumeK"
                + "DezmrzGbhZxdJB0BH8pmuzUwnYf9n5rEk7fwzQEE1DUFh5t063FW"
                + "PFDu8E0UkZNjWMeOOkUPEzjtsdcrMMg3wW872DdV0duqWUFQ7"
                + "gMzWrWAsWpByoTVaCPbbHabVjbwOcvMkKqXarbhRD4UtNu2mT"
                + "1EJPXz14xASx0cgyXF7qCRmbbcp3pkVa6a8xecujotzcJOHmtymvy7K"
                + "90GrNcYdp6HVbSQQGjE0wQ0Z3fdzbv0tGNWjGGXm8vGGu7NWk0"
                + "Qu2EdPo4AwF58w2sgGYtsW9Q0UvWTduKvA5Nh2QEJ5GjsBnSNfW"
                + "JNGuheqFSNjUnJhndbaT7ajv8O28owbMENV0dCrNZhdMD8k4Y5EV"
                + "DkKKsvUshnYwCRvogZTCsm2gf9OU4jC4b1brdkWKZnV0hAKc9V3"
            };

            const middleware = validateRequest(deckSchemas.update);

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: expect.stringContaining("Validation error: Body: Description cannot exceed 500 characters")
            });
            expect(mockNext).not.toHaveBeenCalled();
        });
    });
});