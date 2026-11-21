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
 *               example: "TOKEN_NOT_FOUND"
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Timestamp for when the error occurred.
 *           example: "2026-11-20T20:00:00.000Z"
 */