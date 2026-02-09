import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

/**
 * Login Component
 * Standalone component with reactive login form
 * Uses OnPush change detection for performance
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  loading = false;
  error = '';
  successMessage = '';

  onLogin(): void {
    this.error = '';
    this.successMessage = '';

    if (!this.email || !this.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    this.loading = true;

    // Using observable pattern with take(1) for one-time subscription
    this.authService
      .login(this.email, this.password)
      .subscribe({
        next: (result) => {
          this.loading = false;
          if (result.success) {
            this.successMessage = result.message;
            // Redirect to books after successful login
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 500);
          } else {
            this.error = result.message;
          }
        },
        error: (err) => {
          this.loading = false;
          this.error = 'An error occurred. Please try again.';
        },
      });
  }

  onRegisterClick(): void {
    this.router.navigate(['/register']);
  }
}
