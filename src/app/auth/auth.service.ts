import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';

/**
 * User type for auth system
 */
export interface User {
  id: string;
  email: string;
  username: string;
}

interface RegisterResponse {
  accessToken: string;
  user: User;
}

/**
 * Auth Service
 * Handles user authentication, registration, and session management
 * Implements proper DI with inject() and BehaviorSubject for state
 *
 * Best practices:
 * - BehaviorSubject stores current user state (replays last value)
 * - Observable stream for reactive UI updates
 * - localStorage for session persistence
 * - Immutable state patterns
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly STORAGE_KEY = 'discovera_auth';
  private readonly USERS_KEY = 'discovera_users';
  private readonly TOKEN_KEY = 'discovera_token';
  private readonly API_BASE_URL = 'http://localhost:3000';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  public isAuthenticated$ = this.currentUser$.pipe(
    map(user => user !== null)
  );

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Load user from localStorage on service init
    // This must be done in constructor, not field initializer, so platformId is available
    const savedUser = this.loadUser();
    if (savedUser) {
      this.currentUserSubject.next(savedUser);
    }

    // Initialize with demo user if no users exist
    this.initializeDemoUser();
  }

  /**
   * Register new user
   * Validates email and password, stores encrypted (in real app, use backend)
   */
  register(email: string, username: string, password: string): Observable<{ success: boolean; message: string }> {
    // Basic client-side validation
    if (!email || !username || !password) {
      return of({ success: false, message: 'All fields are required' });
    }

    if (password.length < 6) {
      return of({ success: false, message: 'Password must be at least 6 characters' });
    }

    const payload = { email, username, password };

    return this.http
      .post<RegisterResponse>(`${this.API_BASE_URL}/auth/register`, payload)
      .pipe(
        tap((response) => {
          this.saveUserSession(response.user);
          this.saveToken(response.accessToken);
          this.currentUserSubject.next(response.user);
        }),
        map(() => ({ success: true, message: 'Registration successful!' })),
        catchError((error: HttpErrorResponse) => {
          const message = this.parseErrorMessage(error);
          return of({ success: false, message });
        })
      );
  }

  /**
   * Login user
   * Validates credentials against stored users
   */
  login(email: string, password: string): Observable<{ success: boolean; message: string }> {
    return new Observable(observer => {
      // Validation
      if (!email || !password) {
        observer.next({ success: false, message: 'Email and password are required' });
        observer.complete();
        return;
      }

      const users = this.getAllUsers();
      const user = users.find(u => u.email === email && (u as any).password === password);

      if (!user) {
        observer.next({ success: false, message: 'Invalid email or password' });
        observer.complete();
        return;
      }

      // Extract user without password
      const authenticatedUser: User = {
        id: user.id,
        email: user.email,
        username: user.username,
      };

      this.saveUserSession(authenticatedUser);
      this.currentUserSubject.next(authenticatedUser);

      observer.next({ success: true, message: 'Login successful!' });
      observer.complete();
    });
  }

  /**
   * Logout user
   * Clears session from localStorage and BehaviorSubject
   */
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
    this.currentUserSubject.next(null);
  }

  /**
   * Get current user synchronously
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Private helper methods

  private loadUser(): User | null {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    }
    return null;
  }

  private saveUserSession(user: User): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    }
  }

  private saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  private getAllUsers(): User[] {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(this.USERS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    }
    return [];
  }

  private saveUsers(users: User[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Initialize with demo user for testing
   * Creates a demo user if no users exist
   */
  private initializeDemoUser(): void {
    const users = this.getAllUsers();
    if (users.length === 0) {
      const demoUser = {
        id: this.generateId(),
        email: 'demo@example.com',
        username: 'demo',
        password: 'password123',
      };
      this.saveUsers([demoUser]);
    }
  }

  private parseErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'Network error. Please check your connection and try again.';
    }

    const backendMessage = error?.error?.message;
    if (Array.isArray(backendMessage) && backendMessage.length > 0) {
      return backendMessage.join(' ');
    }

    if (typeof backendMessage === 'string' && backendMessage.trim().length > 0) {
      return backendMessage;
    }

    if (error.status === 400 || error.status === 409) {
      return 'Registration failed. Please check your details and try again.';
    }

    if (error.status >= 500) {
      return 'Server error. Please try again in a moment.';
    }

    return 'Something went wrong, try again.';
  }
}
