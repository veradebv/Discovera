import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookService, Book } from '../book.service';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './book-list.html',
  styleUrl: './book-list.html',
})
export class BookListComponent {
  books: Book[] = [];

  constructor(private bookService: BookService) {
    this.books = this.bookService.getBooks();
  }
}