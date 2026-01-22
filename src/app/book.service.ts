import { Injectable } from '@angular/core';

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
  private books: Book[] = [
    { 
      id: 0, 
      title: 'The Midnight Library', 
      author: 'Matt Haig', 
      rating: 4.2,
      status: 'want-to-read',
      reviews: []
    },
    { 
      id: 1, 
      title: 'Atomic Habits', 
      author: 'James Clear', 
      rating: 4.5,
      status: 'reading',
      reviews: []
    },
    { 
      id: 2, 
      title: 'Norwegian Wood', 
      author: 'Haruki Murakami', 
      rating: 4.0,
      status: 'read',
      reviews: []
    },
  ];

  updateStatus(id: number, status: ReadingStatus){
    const book = this.books.find(book => book.id === id);
    if (!book) return;
  
    book.status = status;
  }

  addReview(bookId: number, text: string) {
  const book = this.books.find(b => b.id === bookId);
  if (!book) return;

  book.reviews.push({
    text,
    createdAt: new Date(),
  });
}


  getBooks(): Book[] {
    return this.books;
  }

  getBookById(id: number): Book | undefined {
    return this.books.find(book => book.id === id);
  }
}
