import express from 'express';
import { check } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest.js';
import * as playlistController from '../controllers/playlistController.js';

const router = express.Router();


router.post(
  '/user',
  [
    check('ID_Usuario').notEmpty().isInt().withMessage('Valid user ID is required'),
    validateRequest
  ],
  playlistController.getUserPlaylists
);

router.post(
  '/',
  [
    check('name').notEmpty().withMessage('Playlist name is required'),
    check('ID_Usuario').notEmpty().isInt().withMessage('Valid user ID is required'),
    check('description').optional().isString(),
    check('coverUrl').optional().isURL().withMessage('Valid cover URL is required'),
    validateRequest
  ],
  playlistController.createPlaylist
);

router.post(
  '/add-song',
  [
    check('playlistIds').isArray().withMessage('Playlist IDs must be an array'),
    check('songId').notEmpty().withMessage('Song ID is required'),
    validateRequest
  ],
  playlistController.addSongToPlaylist
);


router.delete('/:id', playlistController.deletePlaylist);


router.delete('/:playlistId/songs/:songId', playlistController.removeSongFromPlaylist);

export default router;