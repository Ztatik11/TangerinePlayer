export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: true,
    message,
    requestBody: req.body, // <-- Agregado aquí
    details: err.details || null,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};
  
export class ApiError extends Error {
  constructor(message, statusCode, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details; // <-- soporte para detalles opcionales
  }
}