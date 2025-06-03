import { validationResult } from 'express-validator';
import { ApiError } from './errorHandler.js';

export const validateRequest = (req, res, next) => {
  try {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }));
      
      throw new ApiError('Validation failed', 400, {
        errors: errorMessages,
        requestBody: req.body
      });
    }
    
    next();
  } catch (error) {
    // Si es un ApiError, lo pasamos tal cual
    if (error instanceof ApiError) {
      next(error);
    } else {
      // Si es otro tipo de error, lo envolvemos en un ApiError
      next(new ApiError('Validation error', 400, { 
        message: error.message,
        requestBody: req.body 
      }));
    }
  }
};