import { Routes } from '@angular/router';
import { BookListComponent } from './book-list/book-list';
import { BookDetail } from './book-detail/book-detail';

export const routes: Routes = [
    { path: '', component: BookListComponent },
    { path: 'books/:id', component: BookDetail }
];
