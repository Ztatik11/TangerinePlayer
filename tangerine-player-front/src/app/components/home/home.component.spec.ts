import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { PlaylistCardComponent } from '../shared/playlist-card/playlist-card.component';
import { SectionHeaderComponent } from '../shared/section-header/section-header.component';
import { MatIconModule } from '@angular/material/icon';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent, 
        PlaylistCardComponent, 
        SectionHeaderComponent,
        MatIconModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load sections data', () => {
    expect(component.sections).toBeTruthy();
    expect(component.sections.length).toBeGreaterThan(0);
  });

  it('should initialize with sidebar closed', () => {
    expect(component.isSidebarOpen).toBeFalse();
  });

  it('should render section headers', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const headers = compiled.querySelectorAll('app-section-header');
    expect(headers.length).toBe(component.sections.length);
  });
});