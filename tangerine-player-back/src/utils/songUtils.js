import prisma from '../config/prisma.js';

export const createOrGetSong = async (songId, songData) => {
  // Buscar si ya existe
  let song = await prisma.Canciones.findUnique({ where: { id: songId } });
  
  // Si no existe, crearla
  if (!song) {
    song = await prisma.Canciones.create({
      data: {
        id: songId,
        title: songData.title,
        artist: songData.artist,
        album: songData.album,
        duration: songData.duration,
        coverUrl: songData.coverUrl || songData.artwork,
        audioUrl: songData.audioUrl || songData.url
      }
    });
  }

  return song;
};