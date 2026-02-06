import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export type ReadingStatus = 'want-to-read' | 'reading' | 'read';

export interface Review {
  text: string;
  createdAt: Date;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  rating: number;
  status?: ReadingStatus;
  reviews: Review[];
}

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly STORAGE_KEY = 'discovera_books';

  private booksSubject: BehaviorSubject<Book[]> = new BehaviorSubject<Book[]>([]);

  books$ = this.booksSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    const initialBooks = this.loadBooks();
    this.booksSubject.next(initialBooks);
  }

  private loadBooks(): Book[] {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    }

    return [
      {
        id: 0,
        title: 'The Midnight Library',
        author: 'Matt Haig',
        rating: 4.2,
        status: 'want-to-read',
        reviews: [],
      },
      {
        id: 1,
        title: 'Atomic Habits',
        author: 'James Clear',
        rating: 4.5,
        status: 'reading',
        reviews: [],
      },
      {
        id: 2,
        title: 'Norwegian Wood',
        author: 'Haruki Murakami',
        rating: 4.0,
        status: 'read',
        reviews: [],
      },
    ];
  }

  private saveBooks(books: Book[]) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(books));
    }
  }

  getBookById(id: number): Book | undefined {
    return this.booksSubject.value.find(book => book.id === id);
  }

  updateStatus(id: number, status: ReadingStatus) {
    const books = this.booksSubject.value.map(book =>
      book.id === id ? { ...book, status } : book
    );

    this.booksSubject.next(books);
    this.saveBooks(books);
  }


  addReview(bookId: number, text: string) {
    const books = this.booksSubject.value.map(book =>
      book.id === bookId
        ? {
            ...book,
            reviews: [
              ...book.reviews,
              { text, createdAt: new Date() },
            ],
          }
        : book
    );
    this.booksSubject.next(books);
    this.saveBooks(books);
  }
}