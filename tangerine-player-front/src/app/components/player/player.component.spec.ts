import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerComponent } from './player.component';
import { MusicService } from '../../services/music.service';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject } from 'rxjs';

describe('PlayerComponent', () => {
  let component: PlayerComponent;
  let fixture: ComponentFixture<PlayerComponent>;
  let musicService: jasmine.SpyObj<MusicService>;

  const mockCurrentSong$ = new BehaviorSubject({
    title: 'Test Song',
    artist: 'Test Artist',
    image: 'test.jpg',
    audioUrl: 'test.mp3',
    currentTime: '0:00',
    duration: '3:00',
    progress: 0
  });

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('MusicService', [
      'play',
      'pause',
      'setVolume',
      'seek',
      'playNext',
      'playPrevious'
    ], {
      currentSong$: mockCurrentSong$,
      isPlaying: false
    });

    await TestBed.configureTestingModule({
      imports: [PlayerComponent, MatIconModule],
      providers: [
        { provide: MusicService, useValue: spy }
      ]
    }).compileComponents();

    musicService = TestBed.inject(MusicService) as jasmine.SpyObj<MusicService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle play/pause', async () => {
    await component.togglePlay();
    expect(musicService.play).toHaveBeenCalled();

    musicService.isPlaying = true;
    await component.togglePlay();
    expect(musicService.pause).toHaveBeenCalled();
  });

  it('should update volume', () => {
    const event = { target: { value: '50' } } as unknown as Event;
    component.updateVolume(event);
    expect(musicService.setVolume).toHaveBeenCalledWith(50);
  });

  it('should handle seek', () => {
    const event = {
      currentTarget: { offsetWidth: 200 },
      offsetX: 100
    } as unknown as MouseEvent;
    
    component.seek(event);
    expect(musicService.seek).toHaveBeenCalledWith(50);
  });

  it('should play next song', () => {
    component.playNext();
    expect(musicService.playNext).toHaveBeenCalled();
  });

  it('should play previous song', () => {
    component.playPrevious();
    expect(musicService.playPrevious).toHaveBeenCalled();
  });
});