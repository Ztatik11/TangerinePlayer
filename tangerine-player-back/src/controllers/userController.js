import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import { ApiError } from '../middleware/errorHandler.js';

// Get all users
export const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.Usuarios.findMany({
      select: {
        ID: true,
        Usuario: true,
        Nombre: true,
        Apellidos: true,
        Email: true,
        Fecha_nacimiento: true,
        // Exclude password field for security
      }
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// Register new user
export const registerUser = async (req, res, next) => {
  try {
    const { Usuario, Nombre, Apellidos, Email, Clave, Fecha_nacimiento } = req.body;
    
    // Check if email already exists
    const existingUser = await prisma.Usuarios.findFirst({
      where: { Email }
    });
    
    if (existingUser) {
      throw new ApiError('Email already exists', 400);
    }
    
    const hashedPassword = await bcrypt.hash(Clave, 10);
    
    const user = await prisma.Usuarios.create({
      data: {
        Usuario,
        Nombre,
        Apellidos,
        Email,
        Clave: hashedPassword,
        Fecha_nacimiento: new Date(Fecha_nacimiento),
      },
    });
    
    // Remove password from response
    const { Clave: _, ...userWithoutPassword } = user;
    
    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};

// Login user
export const loginUser = async (req, res, next) => {
  try {
    const { Email, Clave } = req.body;
    
    const user = await prisma.Usuarios.findFirst({
      where: { Email }
    });
    
    if (!user) {
      throw new ApiError('Invalid credentials', 401);
    }
    
    const isPasswordValid = await bcrypt.compare(Clave, user.Clave);
    
    if (!isPasswordValid) {
      throw new ApiError('Invalid credentials', 401);
    }
    
    // Remove password from response
    const { Clave: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login successful',
      user: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};

// Update user
export const updateUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const { Nombre, Apellidos, Email, Fecha_nacimiento } = req.body;
    
    // Check if user exists
    const user = await prisma.Usuarios.findUnique({
      where: { ID: userId }
    });
    
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    
    // Prepare data to update
    const dataToUpdate = {};
    
    if (Nombre) dataToUpdate.Nombre = Nombre;
    if (Apellidos) dataToUpdate.Apellidos = Apellidos;
    if (Email) dataToUpdate.Email = Email;
    if (Fecha_nacimiento) dataToUpdate.Fecha_nacimiento = new Date(Fecha_nacimiento);
    
    const updatedUser = await prisma.Usuarios.update({
      where: { ID: userId },
      data: dataToUpdate
    });
    
    // Remove password from response
    const { Clave: _, ...userWithoutPassword } = updatedUser;
    
    res.json({
      message: 'User updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};

// Delete user
export const deleteUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    
    // Check if user exists
    const user = await prisma.Usuarios.findUnique({
      where: { ID: userId }
    });
    
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    
    // Delete user's playlists and related data first
    // This assumes cascading deletion is not set up in the database schema
    
    // Delete user's favorites
    await prisma.Canciones_favoritas.deleteMany({
      where: { ID_Usuario: userId }
    });
    
    // Find user's playlists
    const userPlaylists = await prisma.Playlists.findMany({
      where: { ID_Usuario: userId },
      select: { ID: true }
    });
    
    const playlistIds = userPlaylists.map(playlist => playlist.ID);
    
    // Delete playlist songs
    if (playlistIds.length > 0) {
      await prisma.Playlist_canciones.deleteMany({
        where: { ID_Playlist: { in: playlistIds } }
      });
    }
    
    // Delete playlists
    await prisma.Playlists.deleteMany({
      where: { ID_Usuario: userId }
    });
    
    // Finally delete the user
    await prisma.Usuarios.delete({
      where: { ID: userId }
    });
    
    res.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};