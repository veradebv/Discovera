import { Injectable } from '@angular/core';

export interface Book {
  id: number;
  title: string;
  author: string;
  rating: number;
}

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private books: Book[] = [
    { id: 0, title: 'The Midnight Library', author: 'Matt Haig', rating: 4.2 },
    { id: 1, title: 'Atomic Habits', author: 'James Clear', rating: 4.5 },
    { id: 2, title: 'Norwegian Wood', author: 'Haruki Murakami', rating: 4.0 },
  ];

  getBooks(): Book[] {
    return this.books;
  }

  getBookById(id: number): Book | undefined {
    return this.books.find(book => book.id === id);
  }
}
