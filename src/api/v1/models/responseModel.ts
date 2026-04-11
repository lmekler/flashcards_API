/**
 * Interface representing a standard API response.
 * @template T - The type of the data property.
 */
export interface ApiResponse<T> {
    status: string /** The status of the response, e.g., 'success' or 'error'. */;
    count?: number /** The number of items in the data, if applicable. */;
    data?: T /** The data returned in the response. */;
    message?: string /** A message providing additional information about the response. */;
    error?: string /** An error message, if applicable. */;
    code?: string /** An error code, if applicable. */;
}

/**
 * Creates a success response object.
 * @template T - The type of the data property.
 * @param {T} [data] - The data to include in the response.
 * @param {string} [message] - A message providing additional information about the response.
 * @param {number} [count] - The number of items in the data, if applicable.
 * @returns {ApiResponse<T | {}>} The success response object.
 */
export const successResponse = <T>(
    data?: T /** The data to include in the response. */,
    message?: string /** A message providing additional information about the response. */,
    count?: number /** The number of items in the data, if applicable. */
): ApiResponse<T> => ({
    status: "success",
    count,
    data,
    message,
});

/**
 * Creates a standardized error response object.
 * This ensures all API errors follow the same format for consistent client handling.
 *
 * @param {string} message - The error message to display to the client.
 * @param {string} code - The error code for programmatic handling.
 * @returns {object} A formatted error response object.
 */
export const errorResponse = (message: string, code: string) => ({
    success: false,
    error: {
        message,
        code,
    },
    timestamp: new Date().toISOString(),
});