import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookService, Book, ReadingStatus } from '../book.service';

type FilterStatus = ReadingStatus | 'all';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './book-list.html',
})
export class BookListComponent {
  books: Book[] = [];
  filter: FilterStatus = 'all';

  constructor(private bookService: BookService) {
    this.books = this.bookService.getBooks();
  }

  get filteredBooks(): Book[] {
    if (this.filter === 'all') {
      return this.books;
    }
    return this.books.filter(book => book.status === this.filter);
  }

  setFilter(status: FilterStatus) {
    this.filter = status;
  }
}