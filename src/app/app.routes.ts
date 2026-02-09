import { Routes } from '@angular/router';

/**
 * App Routes Configuration
 *
 * Lazy Loading: Books feature module is loaded on demand
 * This improves initial load time by splitting the code bundle
 *
 * Angular Router best practice:
 * - Feature modules are lazy loaded via loadChildren
 * - Routes are organized by feature (books)
 * - Prevents circular dependencies
 */
export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./books/book.router').then(m => m.BOOKS_ROUTES)
  },
  {
    path: 'about',
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
    redirectTo: ''
  }
];
