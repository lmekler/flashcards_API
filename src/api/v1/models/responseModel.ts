export interface ApiResponse<T> {
    status: string;
    count?: number,
    data?: T;
    message?: string;
    error?: string;
    code?: string;
}

export const successResponse = <T>(
    data?: T,
    message?: string,
    count?: number
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