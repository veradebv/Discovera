import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';

/**
 * Layout Component
 * Provides the main application shell with header, main content area, and footer
 * Using OnPush change detection for optimal performance
 * 
 * Displays authenticated user info and logout button
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
  private readonly authService = inject(AuthService);

  // Observable for current user
  currentUser$ = this.authService.currentUser$;

  logout(): void {
    this.authService.logout();
  }
}
