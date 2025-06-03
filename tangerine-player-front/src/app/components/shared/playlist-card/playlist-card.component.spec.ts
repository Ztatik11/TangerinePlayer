import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaylistCardComponent } from './playlist-card.component';
import { MatIconModule } from '@angular/material/icon';
import { MusicService } from '../../../services/music.service';

describe('PlaylistCardComponent', () => {
  let component: PlaylistCardComponent;
  let fixture: ComponentFixture<PlaylistCardComponent>;
  let musicService: jasmine.SpyObj<MusicService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('MusicService', ['playPlaylist']);

    await TestBed.configureTestingModule({
      imports: [PlaylistCardComponent, MatIconModule],
      providers: [
        { provide: MusicService, useValue: spy }
      ]
    }).compileComponents();

    musicService = TestBed.inject(MusicService) as jasmine.SpyObj<MusicService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistCardComponent);
    component = fixture.componentInstance;
    component.playlist = {
      id: '1',
      name: 'Test Playlist',
      image: 'test.jpg',
      description: 'Test Description'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display playlist information', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h3')?.textContent).toContain('Test Playlist');
    expect(compiled.querySelector('p')?.textContent).toContain('Test Description');
  });

  it('should call playPlaylist when play button is clicked', () => {
    component.playPlaylist();
    expect(musicService.playPlaylist).toHaveBeenCalledWith('1');
  });
});