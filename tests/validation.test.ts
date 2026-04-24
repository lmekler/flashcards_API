// Ecternal module imports
import { Request, Response, NextFunction } from 'express';

// Internal module imports
import { validateRequest } from '../src/api/v1/middleware/validate';
import { deckSchemas } from '../src/api/v1/validation/deckSchemas';
import { flashcardSchemas } from '../src/api/v1/validation/flashcardSchemas';

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
                error: expect.stringContaining(
                    "Validation error: Body: Visibility must be a boolean value")
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
                error: expect.stringContaining(
                    "Validation error: Body: Title cannot exceed 100 characters")
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
                error: expect.stringContaining(
                    "Validation error: Body: Description cannot exceed 500 characters")
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
                error: expect.stringContaining(
                    "Validation error: Body: Visibility must be a boolean value")
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
                error: expect.stringContaining(
                    "Validation error: Body: Description cannot exceed 500 characters")
            });
            expect(mockNext).not.toHaveBeenCalled();
        });
    });

    describe('Create Flashcard Schema', () =>
    {
        it('should pass for valid input', () => 
        {
            // Arrange
            mockReq.params = { deckId:"49GEcb6NqCl6f9JUXOIH" };
            mockReq.body = 
            { 
                question: "Card 001 question",
                answer: "Card 001 answer",
                isMastered: false
            };

            const middleware = validateRequest(flashcardSchemas.create);

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockNext).toHaveBeenCalled();
            expect(mockRes.status).not.toHaveBeenCalled();
            expect(mockRes.json).not.toHaveBeenCalled();
        });

        it('should fail for missing question and answer', () => 
        {
            // Arrange
            mockReq.params = { deckId:"49GEcb6NqCl6f9JUXOIH" };
            mockReq.body = {};

            const middleware = validateRequest(flashcardSchemas.create);

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: expect.stringContaining(
                    "Validation error: Body: Question is required, Body: Answer is required")
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should fail for empty question and answer', () => 
        {
            // Arrange
            mockReq.params = { deckId:"49GEcb6NqCl6f9JUXOIH" };
            mockReq.body = 
            {
                question: "",
                answer: ""
            };

            const middleware = validateRequest(flashcardSchemas.create);

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: expect.stringContaining(
                    "Validation error: Body: Question cannot be"
                    + " empty, Body: Answer cannot be empty")
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should fail for question exceeding 500 characters', () => 
        {
            // Arrange
            mockReq.params = { deckId:"49GEcb6NqCl6f9JUXOIH" };
            mockReq.body = 
            {
                // This question is 501 characters long
                question: "NJToZgFuMOGsjvxY9HV1JctrW7NGeqxOvydtrMEbWDU"
                + "zespHJYM645OPPxAZJGbRXQPFWN71V3rcOSbwbBdrWRZhumeK"
                + "DezmrzGbhZxdJB0BH8pmuzUwnYf9n5rEk7fwzQEE1DUFh5t063FW"
                + "PFDu8E0UkZNjWMeOOkUPEzjtsdcrMMg3wW872DdV0duqWUFQ7"
                + "gMzWrWAsWpByoTVaCPbbHabVjbwOcvMkKqXarbhRD4UtNu2mT"
                + "1EJPXz14xASx0cgyXF7qCRmbbcp3pkVa6a8xecujotzcJOHmtymvy7K"
                + "90GrNcYdp6HVbSQQGjE0wQ0Z3fdzbv0tGNWjGGXm8vGGu7NWk0"
                + "Qu2EdPo4AwF58w2sgGYtsW9Q0UvWTduKvA5Nh2QEJ5GjsBnSNfW"
                + "JNGuheqFSNjUnJhndbaT7ajv8O28owbMENV0dCrNZhdMD8k4Y5EV"
                + "DkKKsvUshnYwCRvogZTCsm2gf9OU4jC4b1brdkWKZnV0hAKc9V3",
                answer: "Card 001 answer"
            };

            const middleware = validateRequest(flashcardSchemas.create);

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: expect.stringContaining(
                    "Validation error: Body: Question cannot exceed 500 characters")
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should fail for answer exceeding 1000 characters', () => 
        {
            // Arrange
            mockReq.params = { deckId:"49GEcb6NqCl6f9JUXOIH" };
            mockReq.body = 
            {
                question: "Card 001 answer",
                // This answer is 1001 characters long
                answer: "sWJuHNvZe4ohH8AXZW7uhnNgDWnpTYV7GjPrbFEDMXe"
                + "scSnWbSvKn0VwHaDQfSknQ0dFM4AT9FQMEyxQ7wZoKvczysRO4EfAu"
                + "gu4eo3rG1GZWfoJbBd9sv5crRmHfEDZOHCMq3PXBhVp8QQf9orCUHE"
                + "MU3dRQPnnRaqx6jfmCAjQWTcvVkrenpcY914ovhAkMmYvf1QewxGTH"
                + "ZeUxxPcthPvfjBEPtsBsPrZQ0WJRuDPgYS5T9XEkUtURaJCVjr3zkoRHydH"
                + "X27pXd7Ya1PPBqvHNDppCG5K1cG0zb9aCtg5ZjOyUeyxZE0s1B1GjKtr4"
                + "cAWrG0z83oVOvut14cUebHeb1Yn2u7X7DUNCbt7o1Jpy0C1RpjVaEPBO"
                + "aK0CtY8rC42a0fkfScDVJYB5Aduu03CYQrns8fyEOVSb29qY7Qn1b3toNv"
                + "VTGfzvZK4QmT89WC4ySJo652ott5x7je3EDyUCuYwBCqYxGDwTEkuKxk"
                + " AOWNu3StPzSwZVHHpNQV9E8OCMdAmTSFdNhQksTggd4pYeoMuGc"
                + "oa9wvPJYOV5jqFcok3FrDB2AV9SEQEbt8tJQKbnMFSsvanes1muPGSKFC"
                + "vG4xy3B6cNuVNjvOA2vjgzC69njywBZ2yRUhhpk3KBnso2SvxHcO9Rk7c"
                + "D9t8NVkpSSvSWZ5QopoSbDDp9WpRazYfQwEjHAN4HEnJw3rJSUEFPf"
                + "DXdVRd41QsB9Y0QChjkgsQrnp2bQJyb4PfArJWK67WV7g3TFfpO7Q2w"
                + "qUzyWGVY9x4Y1gvFfE5bje5MKWuSHXQFkSt8QrCxM2GdbW7j4caABE"
                + "jX25837hACWmgNn7BjAAp4u6az9Z7AGXEt90QeaP0DAjhj0Rf0OFR2b"
                + "OJYDNdCckKadZTsHHkpQExPBdqBfv72zJvQ5xbMTKpde4kkhATXUAv"
                + "WNRjN6u8PR4hNaY9K2vbw5Xg1a0J61VC4WQeP39oKxhJmnccM593"
                + "1sDZAnwK7GD3HEeVodvb"
            };

            const middleware = validateRequest(flashcardSchemas.create);

            
            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: expect.stringContaining(
                    "Validation error: Body: Answer cannot exceed 1000 characters")
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should fail for non boolean isMastered', () => 
        {
            // Arrange
            mockReq.params = { deckId:"49GEcb6NqCl6f9JUXOIH" };
            mockReq.body = 
            {
                question: "Card 001 question",
                answer: "Card 001 answer",
                isMastered: "Not mastered"
            };

            const middleware = validateRequest(flashcardSchemas.create);

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: expect.stringContaining(
                    "Validation error: Body: isMastered must be a boolean value")
            });
            expect(mockNext).not.toHaveBeenCalled();
        });
    });

    describe('Update Flashcard Schema', () =>
    {
        it('should fail for non boolean isMastered', () => 
        {
            // Arrange
            mockReq.body = 
            {
                question: "Card 001 question",
                answer: "Card 001 answer",
                isMastered: "Not mastered"
            };

            const middleware = validateRequest(flashcardSchemas.update);

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: expect.stringContaining(
                    "Validation error: Body: isMastered must be a boolean value")
            });
            expect(mockNext).not.toHaveBeenCalled();
        });
    });
});