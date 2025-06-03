import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CreatePlaylistModalComponent } from '../shared/create-playlist-modal/create-playlist-modal.component';
import userData from '../../data/user.json';
import { UserData } from '../../types/data.types';
import { BehaviorSubject, Subscription } from 'rxjs';
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
export class SidebarComponent implements OnInit, OnDestroy {
  private isSidebarOpenSubject = new BehaviorSubject<boolean>(false);
  isSidebarOpen$ = this.isSidebarOpenSubject.asObservable();
  isSidebarOpen = false;
  showCreatePlaylistModal = false;
  playlists: Playlist[] = [];
  activeOptionsMenu: string | null = null;
  errorMessage: string | null = null;
  private playlistsSubscription: Subscription | null = null;

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
    this.playlistsSubscription = this.playlistService.playlists$
      .subscribe(playlists => {
        this.playlists = playlists;
      });
  }

  ngOnDestroy() {
    if (this.playlistsSubscription) {
      this.playlistsSubscription.unsubscribe();
    }
  }

  addPlaylist() {
    this.showCreatePlaylistModal = true;
    this.errorMessage = null;
  }

  toggleSidebar() {
    this.isSidebarOpenSubject.next(!this.isSidebarOpenSubject.value);
  }

  onCloseModal() {
    this.showCreatePlaylistModal = false;
    this.errorMessage = null;
  }

  onCreatePlaylist(name: string) {
    this.errorMessage = null;
    this.playlistService.createPlaylist(name).subscribe({
      next: () => {
        this.showCreatePlaylistModal = false;
      },
      error: (error) => {
        console.error('Error creating playlist:', error);
        this.errorMessage = error.message || 'Error al crear la playlist';
      }
    });
  }

  openPlaylist(playlistId: string) {
    if (playlistId) {
      this.navigationService.showPlaylist(playlistId);
      this.toggleSidebar();
    }
  }

  toggleOptions(playlistId: string, event: Event) {
    event.stopPropagation();
    this.activeOptionsMenu = this.activeOptionsMenu === playlistId ? null : playlistId;
  }

  deletePlaylist(playlistId: string) {
    this.playlistService.deletePlaylist(playlistId).subscribe({
      next: () => {
        this.activeOptionsMenu = null;
        if (playlistId === this.navigationService.getCurrentPlaylistId()) {
          this.navigationService.showHome();
        }
      },
      error: (error) => {
        console.error('Error deleting playlist:', error);
      }
    });
  }
}