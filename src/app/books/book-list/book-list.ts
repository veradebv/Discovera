import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { BookService, Book, ReadingStatus } from '../../book.service';

type FilterStatus = ReadingStatus | 'all';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookListComponent implements OnInit {
  private readonly bookService = inject(BookService);

  private filterSubject = new BehaviorSubject<FilterStatus>('all');
  filter$ = this.filterSubject.asObservable();

  private searchSubject = new BehaviorSubject<string>('');
  search$ = this.searchSubject.asObservable().pipe(
    debounceTime(300),
    distinctUntilChanged(),
    startWith('')
  );

  /**
   * Combined observable: books filtered by status and search term
   * Uses proper RxJS operators: combineLatest for multiple sources
   * map for transformation, avoiding race conditions with switchMap
   */
  filteredBooks$: Observable<Book[]> = combineLatest([
    this.bookService.books$,
    this.filter$,
    this.search$,
  ]).pipe(
    map(([books, filter, search]) =>
      this.filterAndSearchBooks(books, filter, search)
    )
  );

  ngOnInit(): void {
    // Lifecycle hook ensures component is fully initialized
    // Used only when needed after view initialization
  }

  private filterAndSearchBooks(
    books: Book[],
    filter: FilterStatus,
    search: string
  ): Book[] {
    let filtered = books;

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(book => book.status === filter);
    }

    // Apply search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        book =>
          book.title.toLowerCase().includes(searchLower) ||
          book.author.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }

  setFilter(status: FilterStatus): void {
    this.filterSubject.next(status);
  }

  setSearch(term: string): void {
    this.searchSubject.next(term);
  }
}