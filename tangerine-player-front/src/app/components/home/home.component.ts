import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaylistCardComponent } from '../shared/playlist-card/playlist-card.component';
import { SectionHeaderComponent } from '../shared/section-header/section-header.component';
import { SpotifyService, SpotifyPlaylist } from '../../services/spotify.service';
import { PlaylistService } from '../../services/playlist.service';
import { Subscription } from 'rxjs';

interface Section {
  title: string;
  items: SpotifyPlaylist[];
  genreId?: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, PlaylistCardComponent, SectionHeaderComponent]
})
export class HomeComponent implements OnInit, OnDestroy {
  sections: Section[] = [
    { title: 'Mis listas', items: [] },
    { title: 'Rock', items: [], genreId: 'rock' },
    { title: 'Hip Hop', items: [], genreId: 'hip-hop' },
    { title: 'Electrónica', items: [], genreId: 'electronic' },
    { title: 'Jazz', items: [], genreId: 'jazz' }
  ];
  
  isSidebarOpen = false;
  private playlistsSubscription: Subscription | null = null;

  constructor(
    private spotifyService: SpotifyService,
    private playlistService: PlaylistService
  ) {}

  ngOnInit() {
    this.loadPlaylists();
  }

  ngOnDestroy() {
    if (this.playlistsSubscription) {
      this.playlistsSubscription.unsubscribe();
    }
  }

  private loadPlaylists() {
    // Load user playlists
    this.playlistsSubscription = this.playlistService.playlists$
      .subscribe(playlists => {
        this.sections[0].items = playlists.map(playlist => ({
          id: playlist.id,
          name: playlist.name,
          description: playlist.description || '',
          image: playlist.coverUrl
        }));
      });

    // Load genre playlists
    this.sections.slice(1).forEach(section => {
      if (section.genreId) {
        this.spotifyService.getPlaylistsByGenre(section.genreId).subscribe({
          next: (playlists) => {
            console.log(`Genre playlists loaded for ${section.genreId}:`, playlists);
            section.items = playlists;
          },
          error: (error) => {
            console.error(`Error loading ${section.genreId} playlists:`, error);
            section.items = [];
          }
        });
      }
    });
  }
}