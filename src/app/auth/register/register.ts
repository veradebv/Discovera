import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

/**
 * Register Component
 * Standalone component for user registration
 * Uses OnPush change detection for optimal performance
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  username = '';
  password = '';
  confirmPassword = '';
  loading = false;
  error = '';
  successMessage = '';

  onRegister(): void {
    this.error = '';
    this.successMessage = '';

    // Validation
    if (!this.email || !this.username || !this.password || !this.confirmPassword) {
      this.error = 'Please fill in all fields';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters';
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.error = 'Please enter a valid email';
      return;
    }

    this.loading = true;

    // Using observable pattern for registration
    this.authService
      .register(this.email, this.username, this.password)
      .subscribe({
        next: (result) => {
          this.loading = false;
          if (result.success) {
            this.successMessage = result.message;
            // Redirect to books after successful registration
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

  onLoginClick(): void {
    this.router.navigate(['/login']);
  }
}
