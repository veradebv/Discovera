import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * User type for auth system
 */
export interface User {
  id: string;
  email: string;
  username: string;
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

  private currentUserSubject = new BehaviorSubject<User | null>(this.loadUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  public isAuthenticated$ = this.currentUser$.pipe(
    map(user => user !== null)
  );

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Load user from localStorage on service init
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
    return new Observable(observer => {
      // Validation
      if (!email || !username || !password) {
        observer.next({ success: false, message: 'All fields are required' });
        observer.complete();
        return;
      }

      if (password.length < 6) {
        observer.next({ success: false, message: 'Password must be at least 6 characters' });
        observer.complete();
        return;
      }

      const users = this.getAllUsers();
      const userExists = users.some(u => u.email === email || u.username === username);

      if (userExists) {
        observer.next({ success: false, message: 'Email or username already exists' });
        observer.complete();
        return;
      }

      // Create new user (in real app, hash password on backend)
      const newUser: User = {
        id: this.generateId(),
        email,
        username,
      };

      // Store user and password (in real app, send to backend)
      const updatedUsers = [...users, { ...newUser, password }];
      this.saveUsers(updatedUsers);

      // Auto-login after registration
      this.saveUserSession(newUser);
      this.currentUserSubject.next(newUser);

      observer.next({ success: true, message: 'Registration successful!' });
      observer.complete();
    });
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
}
