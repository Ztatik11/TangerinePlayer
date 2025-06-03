import express from 'express';
import { check } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest.js';
import * as songController from '../controllers/songController.js';

const router = express.Router();

// Get all songs
router.get('/', songController.getSongs);

// Create a new song
router.post(
  '/',
  [
    check('title').notEmpty().withMessage('Title is required'),
    check('artist').notEmpty().withMessage('Artist is required'),
    check('album').notEmpty().withMessage('Album is required'),
    check('duration').notEmpty().withMessage('Duration is required'),
    check('coverUrl').notEmpty().isURL().withMessage('Valid cover URL is required'),
    check('audioUrl').notEmpty().isURL().withMessage('Valid audio URL is required'),
    validateRequest
  ],
  songController.createSong
);

// Update song
router.put(
  '/:id',
  [
    check('title').optional().notEmpty(),
    check('artist').optional().notEmpty(),
    check('album').optional().notEmpty(),
    check('duration').optional().notEmpty(),
    check('coverUrl').optional().isURL(),
    check('audioUrl').optional().isURL(),
    validateRequest
  ],
  songController.updateSong
);

// Delete song
router.delete('/:id', songController.deleteSong);

export default router;