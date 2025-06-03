import express from 'express';
import { check } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest.js';
import * as userController from '../controllers/userController.js';

const router = express.Router();

// Get all users
router.get('/', userController.getUsers);

// User registration
router.post(
  '/register',
  [
    check('Usuario').notEmpty().withMessage('Username is required'),
    check('Nombre').notEmpty().withMessage('First name is required'),
    check('Apellidos').notEmpty().withMessage('Last name is required'),
    check('Email').isEmail().withMessage('Valid email is required'),
    check('Clave').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    check('Fecha_nacimiento').isISO8601().withMessage('Valid date is required'),
    validateRequest
  ],
  userController.registerUser
);

// User login
router.post(
  '/login',
  [
    check('Email').isEmail().withMessage('Valid email is required'),
    check('Clave').notEmpty().withMessage('Password is required'),
    validateRequest
  ],
  userController.loginUser
);

// Update user
router.put(
  '/:id',
  [
    check('Nombre').optional(),
    check('Apellidos').optional(),
    check('Email').optional().isEmail().withMessage('Valid email is required'),
    check('Fecha_nacimiento').optional().isISO8601().withMessage('Valid date is required'),
    validateRequest
  ],
  userController.updateUser
);

// Delete user
router.delete('/:id', userController.deleteUser);

export default router;