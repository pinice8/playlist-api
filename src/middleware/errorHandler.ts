import type { Request, Response, NextFunction } from 'express';

export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('Error:', err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: err.message,
      status: err.statusCode,
    });
  }

  // Default to 500 server error
  return res.status(500).json({
    error: 'Internal server error',
    status: 500,
    ...(process.env.NODE_ENV === 'development' && { details: err.message }),
  });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    error: 'Route not found',
    status: 404,
    path: req.path,
  });
}
