import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of, from } from 'rxjs';
import { map, catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface SpotifySearchResult {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  image: string;
  coverUrl: string;
  audioUrl: string;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private token = new BehaviorSubject<string>('');
  private searchSubject = new BehaviorSubject<string>('');
  private apiUrl = 'https://api.spotify.com/v1';
  private tokenExpirationTime: number = 0;

  constructor(private http: HttpClient) {
    this.initializeToken();
    
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => this.searchTracks(query))
    );
  }

  private async initializeToken() {
    if (this.tokenExpirationTime > Date.now()) {
      return;
    }

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(environment.spotifyClientId + ':' + environment.spotifyClientSecret)
        },
        body: new URLSearchParams({
          'grant_type': 'client_credentials'
        }).toString()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.token.next(data.access_token);
      this.tokenExpirationTime = Date.now() + (data.expires_in * 1000);
    } catch (error) {
      console.error('Error getting Spotify token:', error);
      this.token.next('');
    }
  }

  private async ensureValidToken(): Promise<string> {
    if (this.tokenExpirationTime <= Date.now()) {
      await this.initializeToken();
    }
    return this.token.value;
  }

  getFeaturedPlaylists(): Observable<SpotifyPlaylist[]> {
    return from(this.ensureValidToken()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        const params = new HttpParams()
          .set('limit', '20')
          .set('country', 'ES')
          .set('locale', 'es_ES');

        console.log('Fetching featured playlists...');
        return this.http.get(`${this.apiUrl}/browse/featured-playlists`, { headers, params }).pipe(
          tap(response => console.log('Featured playlists response:', response)),
          map((response: any) => {
            if (response?.playlists?.items) {
              return response.playlists.items.map((playlist: any) => ({
                id: playlist.id,
                name: playlist.name,
                description: playlist.description || '',
                image: playlist.images?.[0]?.url || 'https://picsum.photos/seed/default/300/300'
              }));
            }
            console.warn('No playlists found in response');
            return [];
          }),
          catchError(error => {
            console.error('Error fetching featured playlists:', error);
            return of([]);
          })
        );
      })
    );
  }

  getPlaylistsByGenre(genreId: string): Observable<SpotifyPlaylist[]> {
    return from(this.ensureValidToken()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        const params = new HttpParams()
          .set('seed_genres', genreId)
          .set('limit', '5');

        console.log(`Fetching playlists for genre: ${genreId}`);
        return this.http.get(`${this.apiUrl}/recommendations`, { headers, params }).pipe(
          tap(response => console.log('Genre playlists response:', response)),
          map((response: any) => {
            if (response?.tracks) {
              return response.tracks.map((track: any) => ({
                id: track.id,
                name: track.name,
                description: track.artists?.[0]?.name || '',
                image: track.album?.images?.[0]?.url || 'https://picsum.photos/seed/default/300/300'
              }));
            }
            console.warn('No tracks found in response');
            return [];
          }),
          catchError(error => {
            console.error('Error fetching genre playlists:', error);
            return of([]);
          })
        );
      })
    );
  }

  search(query: string): Observable<SpotifySearchResult[]> {
    if (!query.trim()) {
      return of([]);
    }

    return from(this.ensureValidToken()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        const params = new HttpParams()
          .set('q', query)
          .set('type', 'track')
          .set('market', 'ES')
          .set('limit', '5');

        console.log(`Searching for: ${query}`);
        return this.http.get(`${this.apiUrl}/search`, { headers, params }).pipe(
          tap(response => console.log('Search response:', response)),
          map((response: any) => {
            if (response?.tracks?.items) {
              return response.tracks.items.map((track: any) => ({
                id: track.id,
                title: track.name,
                artist: track.artists?.[0]?.name || 'Unknown Artist',
                album: track.album?.name || 'Unknown Album',
                duration: this.formatDuration(track.duration_ms),
                image: track.album?.images?.[0]?.url || 'https://picsum.photos/seed/default/300/300',
                coverUrl: track.album?.images?.[0]?.url || 'https://picsum.photos/seed/default/300/300',
                audioUrl: track.preview_url || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
              }));
            }
            console.warn('No tracks found in response');
            return [];
          }),
          catchError(error => {
            console.error('Error searching tracks:', error);
            return of([]);
          })
        );
      })
    );
  }

  private formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  private searchTracks(query: string): Observable<SpotifySearchResult[]> {
    return this.search(query);
  }

  updateSearch(query: string) {
    this.searchSubject.next(query);
  }
}