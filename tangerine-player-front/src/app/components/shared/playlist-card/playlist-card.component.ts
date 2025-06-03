import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MusicService } from '../../../services/music.service';
import { NavigationService } from '../../../services/navigation.service';
import { PlaylistService } from '../../../services/playlist.service';
import { PlaylistCard } from '../../../interfaces/music.interfaces';

@Component({
  selector: 'app-playlist-card',
  templateUrl: './playlist-card.component.html',
  styleUrls: ['./playlist-card.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule]
})
export class PlaylistCardComponent {
  @Input() playlist!: PlaylistCard;

  constructor(
    private musicService: MusicService,
    private navigationService: NavigationService,
    private playlistService: PlaylistService
  ) {}

  playPlaylist(event: MouseEvent) {
    event.stopPropagation();
    if (this.playlist.id) {
      console.log('Loading playlist for playback:', this.playlist.id);
      this.playlistService.getPlaylists().subscribe({
        next: (playlists) => {
          const playlist = playlists.find(p => p.id === this.playlist.id);
          if (playlist && playlist.songs && playlist.songs.length > 0) {
            console.log('Found playlist with songs:', playlist);
            this.musicService.setPlaylist(playlist.songs);
            this.musicService.playPlaylist(playlist.songs, 0);
          } else {
            console.warn('Playlist not found or empty:', this.playlist.id);
          }
        },
        error: (error) => {
          console.error('Error loading playlist for playback:', error);
        }
      });
    }
  }

  openPlaylist() {
    if (this.playlist.id) {
      this.navigationService.showPlaylist(this.playlist.id);
    }
  }
}