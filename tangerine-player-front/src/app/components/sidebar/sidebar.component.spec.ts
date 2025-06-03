import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CreatePlaylistModalComponent } from '../shared/create-playlist-modal/create-playlist-modal.component';
import userData from '../../data/user.json';
import { UserData } from '../../types/data.types';
import { BehaviorSubject } from 'rxjs';
import { PlaylistService } from '../../services/playlist.service';
import { Playlist } from '../../interfaces/music.interfaces';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, CreatePlaylistModalComponent]
})
export class SidebarComponent implements OnInit {
  private isSidebarOpenSubject = new BehaviorSubject<boolean>(false);
  isSidebarOpen$ = this.isSidebarOpenSubject.asObservable();
  isSidebarOpen = false;
  showCreatePlaylistModal = false;
  playlists: Playlist[] = [];

  user = {
    name: (userData as UserData).user.username,
    profilePic: (userData as UserData).user.profilePic
  };

  constructor(
    private playlistService: PlaylistService,
    private navigationService: NavigationService
  ) {
    this.isSidebarOpen$.subscribe(
      isOpen => this.isSidebarOpen = isOpen
    );
  }

  ngOnInit() {
    this.loadPlaylists();
  }

  private loadPlaylists() {
    this.playlistService.getPlaylists().subscribe({
      next: (playlists) => {
        console.log('Playlists loaded:', playlists);
        this.playlists = playlists;
      },
      error: (error) => {
        console.error('Error loading playlists:', error);
        this.playlists = [];
      }
    });
  }

  addPlaylist() {
    this.showCreatePlaylistModal = true;
  }

  toggleSidebar() {
    this.isSidebarOpenSubject.next(!this.isSidebarOpenSubject.value);
  }

  onCloseModal() {
    this.showCreatePlaylistModal = false;
  }

  onCreatePlaylist(name: string) {
    this.playlistService.createPlaylist(name).subscribe({
      next: () => {
        this.loadPlaylists();
        this.showCreatePlaylistModal = false;
      },
      error: (error) => {
        console.error('Error creating playlist:', error);
      }
    });
  }

  openPlaylist(playlistId: string) {
    if (playlistId) {
      this.navigationService.showPlaylist(playlistId);
      this.toggleSidebar();
    }
  }
}