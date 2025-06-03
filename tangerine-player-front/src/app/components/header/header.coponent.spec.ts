import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpotifyService, SpotifySearchResult } from '../../services/spotify.service';
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

  constructor(private spotifyService: SpotifyService) {
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
    console.log('Selected track:', track);
    this.searchResults = [];
    this.searchQuery = '';
  }
}