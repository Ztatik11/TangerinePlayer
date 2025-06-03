import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HomeComponent } from './components/home/home.component';
import { PlayerComponent } from './components/player/player.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { HttpClientModule } from '@angular/common/http';
import { NavigationService } from './services/navigation.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <app-header></app-header>
      <app-sidebar></app-sidebar>
      <app-home *ngIf="!(showPlaylist$ | async)"></app-home>
      <app-playlist *ngIf="showPlaylist$ | async"></app-playlist>
      <app-player></app-player>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: #121212;
      color: white;
      position: relative;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    HomeComponent,
    PlayerComponent,
    PlaylistComponent,
    HttpClientModule
  ]
})
export class AppComponent {
  private readonly _navigationService: NavigationService;
  readonly showPlaylist$;

  constructor(navigationService: NavigationService) {
    this._navigationService = navigationService;
    this.showPlaylist$ = this._navigationService.showPlaylist$;
  }
}