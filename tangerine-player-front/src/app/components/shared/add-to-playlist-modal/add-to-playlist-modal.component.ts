import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Playlist } from '../../../interfaces/music.interfaces';

@Component({
  selector: 'app-add-to-playlist-modal',
  templateUrl: './add-to-playlist-modal.component.html',
  styleUrls: ['./add-to-playlist-modal.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule]
})
export class AddToPlaylistModalComponent {
  @Input() playlists: Playlist[] = [];
  @Input() songTitle: string = '';
  @Input() songId: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() add = new EventEmitter<string[]>();

  selectedPlaylists: Set<string> = new Set();
  errorMessage: string | null = null;

  togglePlaylist(playlistId: string) {
    const playlist = this.playlists.find(p => p.id === playlistId);
    if (playlist && playlist.songs.some(song => song.id === this.songId)) {
      this.errorMessage = `Esta canción ya está en la playlist '${playlist.name}'`;
      return;
    }

    if (this.selectedPlaylists.has(playlistId)) {
      this.selectedPlaylists.delete(playlistId);
    } else {
      this.selectedPlaylists.add(playlistId);
      this.errorMessage = null;
    }
  }

  onClose() {
    this.close.emit();
  }

  onAdd() {
    this.add.emit(Array.from(this.selectedPlaylists));
    this.selectedPlaylists.clear();
  }

  isSelected(playlistId: string): boolean {
    return this.selectedPlaylists.has(playlistId);
  }
}