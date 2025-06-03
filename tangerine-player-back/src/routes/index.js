import express from 'express';
import userRoutes from './userRoutes.js';
import songRoutes from './songRoutes.js';
import playlistRoutes from './playlistRoutes.js';

const router = express.Router();

// Register all routes
router.use('/users', userRoutes);
router.use('/songs', songRoutes);
router.use('/playlists', playlistRoutes);

export default router;