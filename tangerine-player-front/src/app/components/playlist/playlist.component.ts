import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MusicService } from '../../services/music.service';
import { NavigationService } from '../../services/navigation.service';
import { PlaylistService } from '../../services/playlist.service';
import { Song } from '../../interfaces/music.interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule]
})
export class PlaylistComponent implements OnInit, OnDestroy {
  songs: Song[] = [];
  playlistTitle: string = '';
  currentSongId: string | null = null;
  currentPlaylistId: string | null = null;
  showDeleteConfirmation = false;
  songToDelete: string | null = null;
  private playlistSubscription: Subscription | null = null;
  private currentSongSubscription: Subscription | null = null;

  constructor(
    private musicService: MusicService,
    private navigationService: NavigationService,
    private playlistService: PlaylistService
  ) {}

  ngOnInit() {
    this.playlistSubscription = this.navigationService.currentPlaylistId$.subscribe(playlistId => {
      if (playlistId) {
        console.log('Loading playlist:', playlistId);
        this.currentPlaylistId = playlistId;
        this.loadPlaylist(playlistId);
      }
    });

    this.currentSongSubscription = this.musicService.currentSong$.subscribe(song => {
      if (song.id) {
        console.log('Current song updated:', song.id);
        this.currentSongId = song.id;
      }
    });
  }

  ngOnDestroy() {
    if (this.playlistSubscription) {
      this.playlistSubscription.unsubscribe();
    }
    if (this.currentSongSubscription) {
      this.currentSongSubscription.unsubscribe();
    }
  }

  private loadPlaylist(playlistId: string) {
    this.playlistService.getPlaylists().subscribe({
      next: (playlists) => {
        const playlist = playlists.find(p => p.id === playlistId);
        if (playlist) {
          console.log('Playlist loaded:', playlist);
          this.playlistTitle = playlist.name;
          this.songs = playlist.songs;
          this.musicService.setPlaylist(playlist.songs);
        } else {
          console.warn('Playlist not found:', playlistId);
        }
      },
      error: (error) => {
        console.error('Error loading playlist:', error);
      }
    });
  }

  playSong(song: Song) {
    console.log('Playing song:', song);
    const songIndex = this.songs.findIndex(s => s.id === song.id);
    if (songIndex !== -1) {
      this.musicService.playPlaylist(this.songs, songIndex);
    } else {
      console.warn('Song not found in playlist:', song);
    }
  }

  removeSong(event: Event, songId: string) {
    event.stopPropagation();
    console.log('Delete button clicked!');
    
    if (this.songs.length === 1) {
      this.songToDelete = songId;
      this.showDeleteConfirmation = true;
      return;
    }

    this.deleteSong(songId);
  }

  private deleteSong(songId: string) {
    if (!this.currentPlaylistId) {
      console.error('No playlist ID available for song removal');
      return;
    }

    console.log('Attempting to remove song:', songId);
    console.log('Current playlist ID:', this.currentPlaylistId);
    console.log('Current playlist title:', this.playlistTitle);
    console.log('Current songs in playlist:', this.songs.length);

    this.playlistService.removeSongFromPlaylist(this.currentPlaylistId, songId).subscribe({
      next: () => {
        console.log('Song removed successfully from playlist');
        this.songs = this.songs.filter(song => song.id !== songId);
        console.log('Updated songs count:', this.songs.length);
        this.musicService.setPlaylist(this.songs);

        if (this.songs.length === 0) {
          this.deletePlaylist();
        }
      },
      error: (error) => {
        console.error('Error removing song from playlist:', error);
        console.error('Failed to remove song:', songId);
        console.error('From playlist:', this.currentPlaylistId);
        if (error.response) {
          console.error('Server response:', error.response);
        }
      }
    });
  }

  private deletePlaylist() {
    if (!this.currentPlaylistId) return;

    this.playlistService.deletePlaylist(this.currentPlaylistId).subscribe({
      next: () => {
        console.log('Playlist deleted successfully');
        this.navigationService.showHome();
      },
      error: (error) => {
        console.error('Error deleting playlist:', error);
      }
    });
  }

  confirmDelete() {
    if (this.songToDelete) {
      this.deleteSong(this.songToDelete);
    }
    this.closeConfirmation();
  }

  closeConfirmation() {
    this.showDeleteConfirmation = false;
    this.songToDelete = null;
  }

  goHome() {
    this.navigationService.showHome();
  }
}