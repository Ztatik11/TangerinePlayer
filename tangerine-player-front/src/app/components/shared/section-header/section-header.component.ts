import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-header',
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class SectionHeaderComponent {
  @Input() title!: string;
}