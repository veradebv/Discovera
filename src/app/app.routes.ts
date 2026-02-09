import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';

/**
 * App Routes Configuration
 *
 * Authentication Flow:
 * - /login: Public route for user login
 * - /register: Public route for new user registration
 * - /: Books feature (protected by authGuard)
 *
 * Lazy Loading: Books feature module is loaded on demand
 * This improves initial load time by splitting the code bundle
 *
 * Angular Router best practice:
 * - Feature modules are lazy loaded via loadChildren
 * - Routes are protected with guards
 * - Wildcard route must be last
 */
export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: '',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./books/book.router').then(m => m.BOOKS_ROUTES)
  },
  {
    path: 'about',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/about/about').then(m => m.AboutComponent)
  },
  {
    path: 'privacy',
    loadComponent: () =>
      import('./pages/privacy/privacy').then(m => m.PrivacyComponent)
  },
  {
    path: 'terms',
    loadComponent: () =>
      import('./pages/terms/terms').then(m => m.TermsComponent)
  },
  // Wildcard route - must be last
  {
    path: '**',
    redirectTo: 'login'
  }
];
