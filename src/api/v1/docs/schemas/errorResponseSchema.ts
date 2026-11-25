/**
 * @openapi
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       description: Standard error response returned when an API request fails.
 *       required:
 *         - success
 *         - error
 *         - timestamp
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates whether the request was successful. Always false for an error response.
 *           example: false
 *         error:
 *           type: object
 *           description: Contains details about the error.
 *           required:
 *             - message
 *             - code
 *           properties:
 *             message:
 *               type: string
 *               description: A human-readable explanation of why the request failed.
 *               example: "Unauthorized: No token provided"
 *             code:
 *               type: string
 *               description: A machine-readable error code that identifies the type of failure.
 *               example: "AUTHENTICATION_ERROR"
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Timestamp for when the error occurred.
 *           example: "2026-11-20T20:00:00.000Z"
 *
 *   examples:
 *     MissingToken:
 *       summary: No token was sent.
 *       value:
 *         success: false
 *         error:
 *           message: "Unauthorized: No token provided"
 *           code: "TOKEN_NOT_FOUND"
 *         timestamp: "2026-11-21T15:30:00.000Z"
 * 
 *     InvalidToken:
 *       summary: The token is malformed, expired, or otherwise invalid.
 *       value:
 *         success: false
 *         error:
 *           message: "Unauthorized: Token verification failed"
 *           code: "auth/argument-error"
 *         timestamp: "2026-11-21T15:30:00.000Z"
 */
