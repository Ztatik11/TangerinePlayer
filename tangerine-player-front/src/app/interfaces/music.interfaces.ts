export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  coverUrl: string;
  audioUrl: string;
}

export interface CurrentSong {
  id: string;
  title: string;
  artist: string;
  album: string;
  image: string;
  audioUrl: string;
  currentTime: string;
  duration: string;
  progress: number;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  songs: Song[];
}

export interface PlaylistCard {
  id?: string;
  name: string;
  image: string;
  description?: string;
}