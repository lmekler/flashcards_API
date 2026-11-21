/**
 * @openapi
 * components:
 *   schemas:
 *     SuccessResponse:
 *       type: object
 *       description: Standard successful API response.
 *       required:
 *         - status
 *         - data
 *         - message
 *       properties:
 *         status:
 *           type: string
 *           description: Indicates that the request was successful.
 *           enum:
 *             - success
 *           example: success
 *         count:
 *           type: integer
 *           description: The total number of objects returned. Included when data is a list.
 *           example: 10
 *         data:
 *           description: The data returned by the API endpoint. May be a single object or an array of objects.
 *         message:
 *           type: string
 *           description: A human-readable message describing the successful operation.
 *           example: Decks retrieved successfully.
 */