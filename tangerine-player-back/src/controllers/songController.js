import prisma from '../config/prisma.js';
import { ApiError } from '../middleware/errorHandler.js';
import { createOrGetSong } from '../utils/songUtils.js';

// Get all songs
export const getSongs = async (req, res, next) => {
  try {
    const songs = await prisma.Canciones.findMany();
    res.json(songs);
  } catch (error) {
    next(error);
  }
};

// Create a new song
export const createSong = async (req, res, next) => {
  try {
    const { id, ...songData } = req.body;

    if (!id) {
      throw new ApiError('Song ID is required', 400);
    }

    const song = await createOrGetSong(id, songData);

    res.status(201).json({
      message: 'Song created successfully',
      song,
      requestBody: req.body
    });
  } catch (error) {
    next(error);
  }
};

// Update a song
export const updateSong = async (req, res, next) => {
  try {
    console.log('Datos recibidos en el POST /songs:', req.body);
    const songId = req.params.id;
    const data = req.body;

    const existing = await prisma.Canciones.findUnique({
      where: { id: songId }
    });

    if (!existing) {
      throw new ApiError('Song not found', 404);
    }

    const updatedSong = await prisma.Canciones.update({
      where: { id: songId },
      data
    });

    res.json({
      message: 'Song updated successfully',
      song: updatedSong,
      requestBody: req.body
    });
  } catch (error) {
    next(error);
  }
};

// Delete a song
export const deleteSong = async (req, res, next) => {
  try {
    const songId = req.params.id;

    const existing = await prisma.Canciones.findUnique({
      where: { id: songId }
    });

    if (!existing) {
      throw new ApiError('Song not found', 404);
    }

    // Eliminar relaciones en playlist_canciones primero
    await prisma.Playlist_canciones.deleteMany({
      where: { ID_Cancion: songId }
    });

    await prisma.Canciones.delete({
      where: { id: songId }
    });

    res.json({
      message: 'Song deleted successfully',
      requestBody: req.body
    });
  } catch (error) {
    next(error);
  }
};