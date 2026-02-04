import { Routes } from '@angular/router';
import { BookListComponent } from './book-list/book-list';
import { BookDetailComponent } from './book-detail/book-detail';

export const BOOKS_ROUTES: Routes = [
  { path: '', component: BookListComponent },
  { path: 'books/:id', component: BookDetailComponent },
];