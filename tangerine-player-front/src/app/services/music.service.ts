import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Song, CurrentSong } from '../interfaces/music.interfaces';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  private audioElement: HTMLAudioElement | null = null;
  private currentPlaylist: Song[] = [];
  private currentSongIndex = 0;
  
  private currentSongSubject = new BehaviorSubject<CurrentSong>({
    id: '',
    title: '',
    artist: '',
    album: '',
    image: '',
    audioUrl: '',
    currentTime: '0:00',
    duration: '0:00',
    progress: 0
  });

  currentSong$ = this.currentSongSubject.asObservable();
  isPlaying = false;

  constructor() {
    try {
      this.initAudio();
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  }

  private initAudio() {
    try {
      this.audioElement = new Audio();
      this.audioElement.volume = 0.5;

      this.audioElement.addEventListener('timeupdate', () => {
        try {
          this.updateProgress();
        } catch (error) {
          console.error('Error in timeupdate handler:', error);
        }
      });

      this.audioElement.addEventListener('loadedmetadata', () => {
        try {
          this.updateDuration();
        } catch (error) {
          console.error('Error in loadedmetadata handler:', error);
        }
      });

      this.audioElement.addEventListener('ended', () => {
        try {
          this.playNext();
        } catch (error) {
          console.error('Error in ended handler:', error);
        }
      });

      this.audioElement.addEventListener('error', (e) => {
        console.error('Audio element error:', e);
      });

    } catch (error) {
      console.error('Error setting up audio element:', error);
      throw error;
    }
  }

  private formatTime(seconds: number): string {
    try {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return '0:00';
    }
  }

  private updateProgress() {
    if (!this.audioElement) {
      console.warn('No audio element available for progress update');
      return;
    }
    
    try {
      const currentTime = this.formatTime(this.audioElement.currentTime);
      const progress = (this.audioElement.currentTime / this.audioElement.duration) * 100;

      this.currentSongSubject.next({
        ...this.currentSongSubject.value,
        currentTime,
        progress: isNaN(progress) ? 0 : progress
      });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }

  private updateDuration() {
    if (!this.audioElement) {
      console.warn('No audio element available for duration update');
      return;
    }
    
    try {
      const duration = this.formatTime(this.audioElement.duration);
      
      this.currentSongSubject.next({
        ...this.currentSongSubject.value,
        duration
      });
    } catch (error) {
      console.error('Error updating duration:', error);
    }
  }

  loadSong(song: Song) {
    if (!this.audioElement) {
      console.error('No audio element available');
      return;
    }

    try {
      console.log('Loading song:', song);
      this.audioElement.src = song.audioUrl;
      this.audioElement.load();
      
      const currentSong: CurrentSong = {
        id: song.id,
        title: song.title,
        artist: song.artist,
        album: song.album,
        image: song.coverUrl,
        audioUrl: song.audioUrl,
        currentTime: '0:00',
        duration: song.duration,
        progress: 0
      };

      this.currentSongSubject.next(currentSong);
    } catch (error) {
      console.error('Error loading song:', error);
    }
  }

  setPlaylist(songs: Song[]) {
    try {
      console.log('Setting playlist:', songs);
      if (Array.isArray(songs) && songs.length > 0) {
        this.currentPlaylist = [...songs];
        console.log('Current playlist updated:', this.currentPlaylist);
      } else {
        console.warn('Attempted to set invalid playlist:', songs);
      }
    } catch (error) {
      console.error('Error setting playlist:', error);
    }
  }

  async playPlaylist(songs: Song[], startIndex: number = 0) {
    try {
      console.log('Playing playlist:', { songs, startIndex });
      if (!Array.isArray(songs) || songs.length === 0) {
        console.warn('Invalid playlist provided:', songs);
        return;
      }

      this.currentPlaylist = [...songs];
      this.currentSongIndex = startIndex;
      
      const song = this.currentPlaylist[this.currentSongIndex];
      if (song) {
        console.log('Starting playback with song:', song);
        this.loadSong(song);
        await this.play();
      } else {
        console.warn('No song found at index:', startIndex);
      }
    } catch (error) {
      console.error('Error playing playlist:', error);
    }
  }

  private async loadAndPlaySong() {
    try {
      if (this.currentPlaylist.length === 0) {
        console.warn('No songs in playlist');
        return;
      }
      
      const song = this.currentPlaylist[this.currentSongIndex];
      if (song) {
        console.log('Loading and playing song:', song);
        this.loadSong(song);
        await this.play();
      } else {
        console.warn('No song found at index:', this.currentSongIndex);
      }
    } catch (error) {
      console.error('Error loading and playing song:', error);
    }
  }

  async playNext() {
    try {
      if (this.currentPlaylist.length === 0) {
        console.warn('Empty playlist');
        return;
      }
      
      this.currentSongIndex = (this.currentSongIndex + 1) % this.currentPlaylist.length;
      console.log('Playing next song, index:', this.currentSongIndex);
      await this.loadAndPlaySong();
    } catch (error) {
      console.error('Error playing next song:', error);
    }
  }

  async playPrevious() {
    try {
      if (this.currentPlaylist.length === 0) {
        console.warn('Empty playlist');
        return;
      }
      
      this.currentSongIndex = (this.currentSongIndex - 1 + this.currentPlaylist.length) % this.currentPlaylist.length;
      console.log('Playing previous song, index:', this.currentSongIndex);
      await this.loadAndPlaySong();
    } catch (error) {
      console.error('Error playing previous song:', error);
    }
  }

  async play() {
    if (!this.audioElement) {
      console.error('No audio element available');
      return;
    }
    
    try {
      console.log('Playing audio');
      await this.audioElement.play();
      this.isPlaying = true;
    } catch (error) {
      console.error('Error playing audio:', error);
      this.isPlaying = false;
      throw error;
    }
  }

  pause() {
    if (!this.audioElement) {
      console.error('No audio element available');
      return;
    }

    try {
      console.log('Pausing audio');
      this.audioElement.pause();
      this.isPlaying = false;
    } catch (error) {
      console.error('Error pausing audio:', error);
    }
  }

  setVolume(volume: number) {
    if (!this.audioElement) {
      console.error('No audio element available');
      return;
    }

    try {
      const normalizedVolume = Math.max(0, Math.min(1, volume / 100));
      console.log('Setting volume:', normalizedVolume);
      this.audioElement.volume = normalizedVolume;
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  }

  seek(percentage: number) {
    if (!this.audioElement) {
      console.error('No audio element available');
      return;
    }
    
    try {
      const time = (percentage / 100) * (this.audioElement.duration || 0);
      if (!isNaN(time)) {
        console.log('Seeking to:', time);
        this.audioElement.currentTime = time;
        this.updateProgress();
      } else {
        console.warn('Invalid seek time calculated:', time);
      }
    } catch (error) {
      console.error('Error seeking:', error);
    }
  }
}