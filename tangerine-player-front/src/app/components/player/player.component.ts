import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MusicService } from '../../services/music.service';
import { PlaylistService } from '../../services/playlist.service';
import { CurrentSong, Playlist } from '../../interfaces/music.interfaces';
import { AddToPlaylistModalComponent } from '../shared/add-to-playlist-modal/add-to-playlist-modal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, AddToPlaylistModalComponent]
})
export class PlayerComponent implements OnInit, OnDestroy {
  currentSong!: CurrentSong;
  private subscription: Subscription | null = null;
  volume = 50;
  isPlaying = false;
  showAddToPlaylistModal = false;
  playlists: Playlist[] = [];

  constructor(
    private musicService: MusicService,
    private playlistService: PlaylistService
  ) {}

  ngOnInit() {
    this.subscription = this.musicService.currentSong$.subscribe(song => {
      this.currentSong = song;
      this.isPlaying = this.musicService.isPlaying;
    });
    this.loadPlaylists();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private loadPlaylists() {
    this.playlistService.getPlaylists().subscribe(playlists => {
      this.playlists = playlists;
    });
  }

  async togglePlay() {
    if (this.isPlaying) {
      this.musicService.pause();
    } else {
      await this.musicService.play();
    }
    this.isPlaying = this.musicService.isPlaying;
  }

  updateVolume(event: Event) {
    const input = event.target as HTMLInputElement;
    this.volume = parseInt(input.value);
    this.musicService.setVolume(this.volume);
  }

  seek(event: MouseEvent) {
    const progressBar = event.currentTarget as HTMLDivElement;
    const clickPosition = (event.offsetX / progressBar.offsetWidth) * 100;
    this.musicService.seek(clickPosition);
  }

  playNext() {
    this.musicService.playNext();
  }

  playPrevious() {
    this.musicService.playPrevious();
  }

  openAddToPlaylistModal() {
    this.showAddToPlaylistModal = true;
  }

  closeAddToPlaylistModal() {
    this.showAddToPlaylistModal = false;
  }

  addToPlaylists(playlistIds: string[]) {
    if (this.currentSong.id) {
      this.playlistService.addSongToPlaylists(
        this.currentSong,
        playlistIds
      ).subscribe({
        next: () => {
          console.log('Song added to playlists successfully');
          this.loadPlaylists();
          this.showAddToPlaylistModal = false;
        },
        error: (error) => {
          console.error('Error adding song to playlists:', error);
        }
      });
    }
  }
}