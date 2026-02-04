import { Routes } from '@angular/router';
import { BookListComponent } from './books/book-list/book-list';
import { BookDetailComponent } from './books/book-detail/book-detail';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => 
            import('./books/book.router').then(m => m.BOOKS_ROUTES)
    }
];
