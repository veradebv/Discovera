import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastService } from '../../shared/toast/toast.service';

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
  private readonly toastService = inject(ToastService);

  email = '';
  username = '';
  password = '';
  confirmPassword = '';
  loading = false;
  onRegister(): void {
    // Validation
    if (!this.email || !this.username || !this.password || !this.confirmPassword) {
      this.toastService.show('Please fill in all fields', 'error');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.toastService.show('Passwords do not match', 'error');
      return;
    }

    if (this.password.length < 6) {
      this.toastService.show('Password must be at least 6 characters', 'error');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.toastService.show('Please enter a valid email', 'error');
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
            this.toastService.show(result.message, 'success');
            // Redirect to books after successful registration
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 500);
          } else {
            this.toastService.show(result.message, 'error');
          }
        },
        error: (err) => {
          this.loading = false;
          this.toastService.show('An error occurred. Please try again.', 'error');
        },
      });
  }

  onLoginClick(): void {
    this.router.navigate(['/login']);
  }
}
