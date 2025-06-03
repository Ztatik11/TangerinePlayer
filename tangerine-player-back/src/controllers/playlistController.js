import prisma from '../config/prisma.js';
import { ApiError } from '../middleware/errorHandler.js';
import { createOrGetSong } from '../utils/songUtils.js';
// Get user playlists
export const getUserPlaylists = async (req, res, next) => {
  try {
    const { ID_Usuario } = req.body;
    
    const user = await prisma.Usuarios.findUnique({
      where: { ID: ID_Usuario }
    });
    
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    
    const playlists = await prisma.Playlists.findMany({
      where: {
        ID_Usuario
      },
      include: {
        Playlist_canciones: {
          include: {
            Canciones: true
          }
        }
      }
    });
    
    // Transform the response to match the interface
    const formattedPlaylists = playlists.map(playlist => ({
      id: playlist.ID.toString(),
      name: playlist.Nombre || '',
      description: playlist.description || '',
      coverUrl: playlist.coverUrl || '',
      songs: playlist.Playlist_canciones.map(pc => ({
        id: pc.Canciones.id,
        title: pc.Canciones.title,
        artist: pc.Canciones.artist,
        album: pc.Canciones.album,
        duration: pc.Canciones.duration,
        coverUrl: pc.Canciones.coverUrl,
        audioUrl: pc.Canciones.audioUrl
      }))
    }));
    
    res.json({
      playlists: formattedPlaylists,
      requestBody: req.body
    });
  } catch (error) {
    next(error);
  }
};

export const createPlaylist = async (req, res, next) => {
  try {
    const { name, description, coverUrl, ID_Usuario } = req.body;

    const user = await prisma.Usuarios.findUnique({
      where: { ID: ID_Usuario }
    });

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    const playlist = await prisma.Playlists.create({
      data: {
        Nombre: name,
        description,
        coverUrl,
        ID_Usuario
      }
    });

    res.status(201).json({
      message: 'Playlist created successfully',
      playlist: {
        id: playlist.ID.toString(),
        name: playlist.Nombre || '',
        description: playlist.description || '',
        coverUrl: playlist.coverUrl || '',
        songs: []
      },
      requestBody: req.body
    });
  } catch (error) {
    next(error);
  }
};

export const addSongToPlaylist = async (req, res, next) => {
  try {
    const { playlistIds, songId, songData } = req.body;

    const song = await createOrGetSong(songId, songData); // ✅ aquí usamos la función común

    // Validar existencia de playlists
    const playlists = await prisma.Playlists.findMany({
      where: {
        ID: {
          in: playlistIds.map(id => parseInt(id))
        }
      }
    });

    if (playlists.length !== playlistIds.length) {
      throw new ApiError('One or more playlists not found', 404);
    }

    // Agregar canción a cada playlist
    const results = await Promise.all(
      playlistIds.map(async (playlistId) => {
        const existingEntry = await prisma.Playlist_canciones.findFirst({
          where: {
            ID_Playlist: parseInt(playlistId),
            ID_Cancion: songId
          }
        });

        if (!existingEntry) {
          return prisma.Playlist_canciones.create({
            data: {
              ID_Playlist: parseInt(playlistId),
              ID_Cancion: songId
            }
          });
        }
        return null;
      })
    );

    res.status(201).json({
      message: 'Song added to playlists successfully',
      song,
      addedToPlaylists: results.filter(r => r !== null).length,
      requestBody: req.body
    });
  } catch (error) {
    next(error);
  }
};

// Delete a playlist
export const deletePlaylist = async (req, res, next) => {
  try {
    const playlistId = parseInt(req.params.id);
    
    const playlist = await prisma.Playlists.findUnique({
      where: { ID: playlistId }
    });
    
    if (!playlist) {
      throw new ApiError('Playlist not found', 404);
    }
    
    await prisma.Playlists.delete({
      where: { ID: playlistId }
    });
    
    res.json({
      message: 'Playlist deleted successfully',
      requestBody: req.body
    });
  } catch (error) {
    next(error);
  }
};

// Remove song from playlist
export const removeSongFromPlaylist = async (req, res, next) => {
  try {
    const playlistId = parseInt(req.params.playlistId);
    const songId = req.params.songId;
    
    const playlist = await prisma.Playlists.findUnique({
      where: { ID: playlistId }
    });
    
    if (!playlist) {
      throw new ApiError('Playlist not found', 404);
    }
    
    await prisma.Playlist_canciones.deleteMany({
      where: {
        ID_Playlist: playlistId,
        ID_Cancion: songId
      }
    });
    
    res.json({
      message: 'Song removed from playlist successfully',
      requestBody: req.body
    });
  } catch (error) {
    next(error);
  }
};