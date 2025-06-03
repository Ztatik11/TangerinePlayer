import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private showPlaylistSubject = new BehaviorSubject<boolean>(false);
  private currentPlaylistIdSubject = new BehaviorSubject<string>('');
  
  showPlaylist$ = this.showPlaylistSubject.asObservable();
  currentPlaylistId$ = this.currentPlaylistIdSubject.asObservable();

  showPlaylist(playlistId: string) {
    this.currentPlaylistIdSubject.next(playlistId);
    this.showPlaylistSubject.next(true);
  }

  showHome() {
    this.showPlaylistSubject.next(false);
    this.currentPlaylistIdSubject.next('');
  }

  getCurrentPlaylistId(): string {
    return this.currentPlaylistIdSubject.value;
  }
}