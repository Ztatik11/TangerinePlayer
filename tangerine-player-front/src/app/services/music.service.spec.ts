import { TestBed } from '@angular/core/testing';
import { MusicService } from './music.service';

describe('MusicService', () => {
  let service: MusicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MusicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(service.isPlaying).toBeFalse();
    service.currentSong$.subscribe(song => {
      expect(song.title).toBe('');
      expect(song.artist).toBe('');
      expect(song.progress).toBe(0);
    });
  });

  it('should update volume', () => {
    service.setVolume(50);
    expect(service.isPlaying).toBeFalse();
  });
});