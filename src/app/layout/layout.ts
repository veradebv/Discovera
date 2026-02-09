import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Layout Component
 * Provides the main application shell with header, main content area, and footer
 * Using OnPush change detection for optimal performance
 * @Component marks this class as an Angular component
 */
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  // Layout component is primarily presentational
  // No complex logic needed here - follows SRP principle
}
