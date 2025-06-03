import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, map, tap, of, throwError } from 'rxjs';
import { Playlist, CurrentSong } from '../interfaces/music.interfaces';
import { environment } from '../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  //private apiUrl = `${environment.apiUrl}`;
  private apiUrl = '/api/playlists';
  private userId = 1;
  private playlistsSubject = new BehaviorSubject<Playlist[]>([]);
  playlists$ = this.playlistsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadPlaylists();
  }

  private loadPlaylists() {
    console.log('Cargando playlists desde el servicio');
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');

    this.http.post<Playlist[]>(`${this.apiUrl}/user`, {
      ID_Usuario: this.userId
    }, { 
      headers,
      withCredentials: false
    }).pipe(
      tap(playlists => console.log('Playlists cargadas:', playlists)),
      map(playlists => this.sortPlaylists(playlists)),
      catchError(error => {
        console.error('Error al obtener playlists:', error);
        return of([]);
      })
    ).subscribe(playlists => {
      this.playlistsSubject.next(playlists);
    });
  }

  private sortPlaylists(playlists: Playlist[]): Playlist[] {
    return [...playlists].sort((a, b) => a.name.localeCompare(b.name));
  }

  getPlaylists(): Observable<Playlist[]> {
    return this.playlists$;
  }

  createPlaylist(name: string): Observable<Playlist> {
    const currentPlaylists = this.playlistsSubject.value;
    const playlistExists = currentPlaylists.some(playlist => 
      playlist.name.toLowerCase() === name.toLowerCase()
    );

    if (playlistExists) {
      return throwError(() => new Error('Ya existe una playlist con ese nombre'));
    }

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');

    const newPlaylist = {
      name,
      description: '',
      coverUrl: `https://picsum.photos/seed/${Date.now()}/300/300`,
      ID_Usuario: this.userId
    };

    return this.http.post<{message: string, playlist: Playlist}>(this.apiUrl, newPlaylist, { 
      headers,
      withCredentials: false
    }).pipe(
      map(response => response.playlist),
      tap(playlist => {
        const currentPlaylists = this.playlistsSubject.value;
        const updatedPlaylists = this.sortPlaylists([...currentPlaylists, playlist]);
        this.playlistsSubject.next(updatedPlaylists);
      }),
      catchError(error => {
        console.error('Error al crear playlist:', error);
        throw error;
      })
    );
  }

  deletePlaylist(playlistId: string): Observable<void> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');

    return this.http.delete<void>(`${this.apiUrl}/${playlistId}`, {
      headers,
      withCredentials: false
    }).pipe(
      tap(() => {
        const currentPlaylists = this.playlistsSubject.value;
        const updatedPlaylists = currentPlaylists.filter(p => p.id !== playlistId);
        this.playlistsSubject.next(updatedPlaylists);
      }),
      catchError(error => {
        console.error('Error al eliminar playlist:', error);
        throw error;
      })
    );
  }

  removeSongFromPlaylist(playlistId: string, songId: string): Observable<void> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');

    const numericPlaylistId = parseInt(playlistId, 10);
    
    console.log('Eliminando canción:', songId, 'de la playlist:', numericPlaylistId);
    
    return this.http.delete<void>(`${this.apiUrl}/${numericPlaylistId}/songs/${songId}`, {
      headers,
      withCredentials: false
    }).pipe(
      tap(() => {
        const currentPlaylists = this.playlistsSubject.value;
        const updatedPlaylists = currentPlaylists.map(playlist => {
          if (playlist.id === playlistId) {
            return {
              ...playlist,
              songs: playlist.songs.filter(song => song.id !== songId)
            };
          }
          return playlist;
        });
        this.playlistsSubject.next(this.sortPlaylists(updatedPlaylists));
      }),
      catchError(error => {
        console.error('Error al eliminar canción de la playlist:', error);
        throw error;
      })
    );
  }

  addSongToPlaylists(currentSong: CurrentSong, playlistIds: string[]): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');

    const data = {
      songId: currentSong.id,
      playlistIds,
      songData: {
        title: currentSong.title,
        artist: currentSong.artist,
        album: currentSong.album,
        duration: currentSong.duration,
        artwork: currentSong.image,
        url: currentSong.audioUrl
      }
    };

    return this.http.post(`${this.apiUrl}/add-song`, data, {
      headers,
      withCredentials: false
    }).pipe(
      tap(() => this.loadPlaylists()),
      catchError(error => {
        console.error('Error al añadir canción a las playlists:', error);
        throw error;
      })
    );
  }

  updatePlaylist(playlistId: string, updatedPlaylist: Playlist) {
    const currentPlaylists = this.playlistsSubject.value;
    const updatedPlaylists = currentPlaylists.map(p => 
      p.id === playlistId ? updatedPlaylist : p
    );
    this.playlistsSubject.next(this.sortPlaylists(updatedPlaylists));
  }
}