export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  coverUrl: string;
  audioUrl: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  songs: Song[];
}

export interface Genre {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  songs: string[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  profilePic: string;
  following: number;
  followers: number;
  playlists: string[];
  recentlyPlayed: string[];
  likedSongs: string[];
  preferences: {
    theme: string;
    language: string;
    notifications: boolean;
  };
}

export interface SongsData {
  songs: Song[];
}

export interface PlaylistsData {
  playlists: Playlist[];
}

export interface GenresData {
  genres: Genre[];
}

export interface UserData {
  user: User;
}