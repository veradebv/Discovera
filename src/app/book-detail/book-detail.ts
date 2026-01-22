import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService, Book, ReadingStatus } from '../book.service';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-detail.html',
})
export class BookDetailComponent {
  book?: Book;
  newReview = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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

  addReview() {
    if (!this.book || !this.newReview.trim()) return;

    this.bookService.addReview(this.book.id, this.newReview);
    this.newReview = '';
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
