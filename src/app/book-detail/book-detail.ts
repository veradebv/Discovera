import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookService, Book, ReadingStatus } from '../book.service';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-detail.html',
})
export class BookDetailComponent {
  book?: Book;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.book = this.bookService.getBookById(id);
  }

  setStatus(status: ReadingStatus) {
    if (!this.book) return;
    
      this.bookService.updateStatus(this.book.id, status);
      this.book.status = status;
  }
}
