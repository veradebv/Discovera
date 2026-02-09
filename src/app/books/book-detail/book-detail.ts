import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { BookService, Book, ReadingStatus } from '../../book.service';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly bookService = inject(BookService);

  newReview = '';

  /**
   * Reactive routing pattern: use paramMap observable with switchMap
   * switchMap cancels previous subscription when route changes
   * Prevents race conditions and memory leaks
   */
  book$!: Observable<Book | undefined>;

  ngOnInit(): void {
    // Initialize book$ observable in ngOnInit (lifecycle hook best practice)
    this.book$ = this.route.paramMap.pipe(
      switchMap(paramMap => {
        const id = Number(paramMap.get('id'));
        return this.bookService.books$.pipe(
          map(books => books.find(book => book.id === id))
        );
      })
    );
  }

  setStatus(status: ReadingStatus): void {
    this.book$.pipe(
      switchMap(book => {
        if (!book) throw new Error('Book not found');
        this.bookService.updateStatus(book.id, status);
        return this.book$;
      })
    ).subscribe();
  }

  addReview(book: Book | undefined): void {
    if (!book || !this.newReview.trim()) return;

    this.bookService.addReview(book.id, this.newReview);
    this.newReview = '';
  }

  goBack(): void {
    this.router.navigate(['/']);
  }}