import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { switchMap, map, tap } from 'rxjs/operators';
import { BookService, Book, ReadingStatus } from '../../book.service';
import { AuthService } from '../../auth/auth.service';

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
  private readonly authService = inject(AuthService);

  newReview = '';
  bookId: number | null = null;

  /**
   * Reactive routing pattern: use paramMap observable with switchMap
   * switchMap cancels previous subscription when route changes
   * Prevents race conditions and memory leaks
   */
  book$!: Observable<Book | undefined>;
  currentUser$ = this.authService.currentUser$;

  ngOnInit(): void {
    // Initialize book$ observable in ngOnInit (lifecycle hook best practice)
    this.book$ = this.route.paramMap.pipe(
      map(paramMap => this.parseBookId(paramMap.get('id'))),
      tap(id => {
        this.bookId = id;
      }),
      switchMap(id =>
        this.bookService.books$.pipe(
          map(books => books.find(book => book.id === id))
        )
      )
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

  addReview(): void {
    const id = this.bookId ?? this.parseBookId(this.route.snapshot.paramMap.get('id'));
    if (id === null || !this.newReview.trim()) return;

    const book = this.bookService.getBookById(id);
    if (!book) return;

    const currentUser = this.authService.getCurrentUser();
    const reviewerName =
      currentUser?.username?.trim() ||
      currentUser?.email?.split('@')[0] ||
      'Anonymous';

    this.bookService.addReview(
      id,
      this.newReview,
      reviewerName,
      undefined // Avatar can be added later
    );
    this.newReview = '';
  }

  private parseBookId(rawId: string | null): number | null {
    const id = Number(rawId);
    return Number.isFinite(id) ? id : null;
  }

  deleteReview(book: Book | undefined, reviewIndex: number): void {
    if (!book) return;
    this.bookService.deleteReview(book.id, reviewIndex);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }}