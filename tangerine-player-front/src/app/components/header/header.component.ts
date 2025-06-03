import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpotifyService, SpotifySearchResult } from '../../services/spotify.service';
import { MusicService } from '../../services/music.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class HeaderComponent {
  searchQuery: string = '';
  searchResults: SpotifySearchResult[] = [];
  private searchSubject = new Subject<string>();

  constructor(
    private spotifyService: SpotifyService,
    private musicService: MusicService
  ) {
    this.setupSearch();
  }

  private setupSearch() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => this.spotifyService.search(query))
    ).subscribe(results => {
      this.searchResults = results;
    });
  }

  onSearch() {
    this.searchSubject.next(this.searchQuery);
  }

  selectTrack(track: SpotifySearchResult) {
    const song = {
      id: track.id,
      title: track.title,
      artist: track.artist,
      album: track.album,
      duration: '0:00',
      coverUrl: track.image,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    };

    this.musicService.loadSong(song);
    this.musicService.play();
    this.searchResults = [];
    this.searchQuery = '';
  }
}