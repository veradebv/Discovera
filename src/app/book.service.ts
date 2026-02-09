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
  /** Optional URL to a cover image */
  image?: string;
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

  /**
   * Get all books as an observable (reactive approach)
   * Use with async pipe in templates: books$ | async
   */
  getBooks$ = () => this.books$;

  /**
   * Get all books synchronously (snapshot)
   * Returns current value from BehaviorSubject
   */
  getBooks(): Book[] {
    return this.booksSubject.value;
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
        image: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=5b3a5b4b8c7a9d1f9e3f0a0f6e6a7b8c',
        status: 'want-to-read',
        reviews: [],
      },
      {
        id: 1,
        title: 'Atomic Habits',
        author: 'James Clear',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=1a2b3c4d5e6f7g8h9i0j',
        status: 'reading',
        reviews: [],
      },
      {
        id: 2,
        title: 'Norwegian Wood',
        author: 'Haruki Murakami',
        rating: 4.0,
        image: 'https://images.unsplash.com/photo-1473862171294-34a8d7c4d1f8?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=abcdef1234567890',
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