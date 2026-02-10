import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

/**
 * Auth Guard
 * Functional guard to protect routes - only authenticated users can access
 * 
 * Angular 21 pattern: Use CanActivateFn with inject() for functional guards
 * No need for guard class - simpler, more tree-shakeable
 * 
 * Usage: { path: 'books', canActivate: [authGuard] }
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      }
      // Redirect to login if not authenticated
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    })
  );
};

/**
 * Not Auth Guard
 * Prevents authenticated users from accessing login/register pages
 * Redirects to home if user is already logged in
 * 
 * Usage: { path: 'login', canActivate: [notAuthGuard] }
 */
export const notAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (!isAuthenticated) {
        // User not authenticated, allow access to login/register
        return true;
      }
      // User is authenticated, redirect to home
      router.navigate(['/']);
      return false;
    })
  );
};
