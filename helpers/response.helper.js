// helpers/response.helper.js
import { SOMETHING_WENT_WRONG } from "./message.helper.js";

/**
 * ✅ Send a standardized success response
 * @param {Object} res - Express response object
 * @param {string} [message=""] - Success message
 * @param {any} [data=null] - Optional payload
 * @param {number} [statusCode=200] - HTTP status code
 */
export const successResponse = (res, message = "", data = null, statusCode = 200) => {
  const response = {
    success: true,
    message,
  };

  // Only include data if provided
  if (data !== null && data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * ❌ Send a standardized error response
 * @param {Object} res - Express response object
 * @param {string} [message=SOMETHING_WENT_WRONG] - Error message
 * @param {number} [statusCode=500] - HTTP status code
 * @param {Error|string|null} [error=null] - Optional error details
 */
export const errorResponse = (res, message = SOMETHING_WENT_WRONG, statusCode = 500, error = null) => {
  const response = {
    success: false,
    message,
  };

  // Show error stack only in development
  if (process.env.NODE_ENV === "development" && error) {
    response.error =
      typeof error === "string"
        ? error
        : error.message || JSON.stringify(error);
  }

  return res.status(statusCode).json(response);
};
