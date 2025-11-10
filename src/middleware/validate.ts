import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';
import { ZodError } from 'zod';
import { ApiError } from './errorHandler.js';

/**
 * Middleware factory that validates request body against a Zod schema.
 *
 * This middleware performs runtime validation of the request body using Zod schemas.
 * If validation passes, the validated data replaces req.body (with proper type coercion).
 * If validation fails, it converts Zod errors into user-friendly ApiError responses.
 *
 * @param {ZodSchema} schema - The Zod schema to validate the request body against
 * @returns {Function} Express middleware function that performs validation
 *
 * @example
 * // In routes file
 * router.post('/users', validateBody(createUserSchema), createUser);
 *
 * @example
 * // Validation error response (400 Bad Request)
 * {
 *   "error": "Validation failed: email: Invalid email format, name: Name is required",
 *   "status": 400
 * }
 *
 * @throws {ApiError} 400 error if validation fails with detailed field-level messages
 */
export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Parse and validate request body
      const validated = schema.parse(req.body);

      // Replace req.body with validated and type-coerced data
      req.body = validated;

      // Proceed to next middleware/controller
      next();
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof ZodError) {
        // Format validation errors into readable messages
        const messages = error.issues.map((issue) => {
          const path = issue.path.join('.') || 'body';
          return `${path}: ${issue.message}`;
        });

        // Return 400 Bad Request with validation error details
        next(new ApiError(400, `Validation failed: ${messages.join(', ')}`));
      } else {
        // Pass non-validation errors to error handler
        next(error);
      }
    }
  };
}
