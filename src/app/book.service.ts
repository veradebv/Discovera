import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export type ReadingStatus = 'want-to-read' | 'reading' | 'read';

export interface Review {
  text: string;
  createdAt: string;
  reviewerName: string;
  reviewerAvatar?: string;
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
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as Book[];
          return parsed.map(book => {
            const normalizedReviews = (book.reviews || []).map(review => ({
              ...review,
              reviewerName: review.reviewerName || 'Anonymous',
              createdAt:
                typeof review.createdAt === 'string'
                  ? review.createdAt
                  : new Date(review.createdAt as any).toISOString(),
            }));

            normalizedReviews.sort((a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            return {
              ...book,
              reviews: normalizedReviews,
            };
          });
        }
      } catch {
        // If storage is unavailable (e.g., Safari private mode), fall back to defaults
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
        image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3',
        status: 'read',
        reviews: [],
      },
      {
        id: 3,
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        rating: 4.0,
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3',
        status: 'want-to-read',
        reviews: [],
      },
      {
        id: 4,
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        rating: 4.0,
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3',
        status: 'reading',
        reviews: [],
      },
      {
        id: 5,
        title: '1984',
        author: 'George Orwell',
        rating: 4.0,
        image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3',
        status: 'want-to-read',
        reviews: [],
      },
      {
        id: 6,
        title: 'The Little Prince',
        author: 'Antoine de Saint-Exupéry',
        rating: 5.0,
        image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3',
        status: 'reading',
        reviews: [],
      },
      {
        id: 7,
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        rating: 5.0,
        image: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3',
        status: 'read',
        reviews: [],
      },
    ];
  }

  private saveBooks(books: Book[]) {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(books));
      } catch {
        // Ignore storage errors (e.g., Safari private mode)
      }
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


  addReview(bookId: number, text: string, reviewerName: string, reviewerAvatar?: string) {
    const books = this.booksSubject.value.map(book =>
      book.id === bookId
        ? {
            ...book,
            reviews: [
              { text, reviewerName, reviewerAvatar, createdAt: new Date().toISOString() },
              ...(book.reviews || []),
            ],
          }
        : book
    );
    this.booksSubject.next(books);
    this.saveBooks(books);
  }

  /**
   * Delete a review by index
   * @param bookId - Book ID containing the review
   * @param reviewIndex - Index of the review to delete
   */
  deleteReview(bookId: number, reviewIndex: number) {
    const books = this.booksSubject.value.map(book =>
      book.id === bookId
        ? {
            ...book,
            reviews: book.reviews.filter((_, index) => index !== reviewIndex),
          }
        : book
    );
    this.booksSubject.next(books);
    this.saveBooks(books);
  }
}